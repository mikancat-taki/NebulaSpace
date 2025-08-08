import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema, insertMemoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store WebSocket connections
  const connections = new Map<string, { ws: WebSocket, userId?: string, username?: string }>();

  wss.on('connection', (ws) => {
    const connectionId = Math.random().toString(36).substring(7);
    connections.set(connectionId, { ws });

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'join':
            connections.set(connectionId, { 
              ws, 
              userId: message.userId, 
              username: message.username 
            });
            if (message.userId) {
              await storage.updateUserOnlineStatus(message.userId, true);
            }
            // Broadcast user joined
            broadcast({ 
              type: 'userJoined', 
              username: message.username,
              onlineUsers: await storage.getOnlineUsers()
            });
            break;

          case 'message':
            if (message.content && message.username) {
              const savedMessage = await storage.createMessage({
                content: message.content,
                username: message.username,
                channel: message.channel || 'general',
                userId: connections.get(connectionId)?.userId || 'anonymous'
              });
              
              broadcast({
                type: 'newMessage',
                message: savedMessage
              });
            }
            break;

          case 'typing':
            broadcast({
              type: 'userTyping',
              username: message.username,
              isTyping: message.isTyping
            }, connectionId);
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', async () => {
      const connection = connections.get(connectionId);
      if (connection?.userId) {
        await storage.updateUserOnlineStatus(connection.userId, false);
        broadcast({
          type: 'userLeft',
          username: connection.username,
          onlineUsers: await storage.getOnlineUsers()
        });
      }
      connections.delete(connectionId);
    });

    function broadcast(data: any, excludeConnectionId?: string) {
      const message = JSON.stringify(data);
      connections.forEach((connection, id) => {
        if (id !== excludeConnectionId && connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.send(message);
        }
      });
    }
  });

  // API Routes
  app.get('/api/messages', async (req, res) => {
    try {
      const channel = req.query.channel as string || 'general';
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getMessages(channel, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get messages' });
    }
  });

  app.get('/api/users/online', async (req, res) => {
    try {
      const users = await storage.getOnlineUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get online users' });
    }
  });

  // Memo routes
  app.post('/api/memos', async (req, res) => {
    try {
      const memoData = insertMemoSchema.parse(req.body);
      const userId = req.body.userId || 'anonymous';
      const memo = await storage.createMemo({ ...memoData, userId });
      res.json(memo);
    } catch (error) {
      res.status(400).json({ message: 'Invalid memo data' });
    }
  });

  app.get('/api/memos/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const memos = await storage.getUserMemos(userId);
      res.json(memos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get memos' });
    }
  });

  app.put('/api/memos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const memoData = insertMemoSchema.partial().parse(req.body);
      const memo = await storage.updateMemo(id, memoData);
      if (memo) {
        res.json(memo);
      } else {
        res.status(404).json({ message: 'Memo not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid memo data' });
    }
  });

  app.delete('/api/memos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMemo(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: 'Memo not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete memo' });
    }
  });

  return httpServer;
}
