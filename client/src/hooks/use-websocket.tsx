import { useEffect, useRef, useState } from 'react';
import { WebSocketMessage, ChatMessage, User } from '@/types/chat';

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setSocket(ws);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          switch (data.type) {
            case 'newMessage':
              if (data.message) {
                setMessages(prev => [...prev, data.message!]);
              }
              break;
            case 'userJoined':
            case 'userLeft':
              if (data.onlineUsers) {
                setOnlineUsers(data.onlineUsers);
              }
              break;
            case 'userTyping':
              if (data.username) {
                setTypingUsers(prev => {
                  if (data.isTyping) {
                    return prev.includes(data.username!) ? prev : [...prev, data.username!];
                  } else {
                    return prev.filter(user => user !== data.username);
                  }
                });
              }
              break;
          }
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setSocket(null);
        console.log('WebSocket disconnected');
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = (message: Omit<WebSocketMessage, 'type'> & { type?: WebSocketMessage['type'] }) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ type: 'message', ...message }));
    }
  };

  const joinChat = (username: string, userId?: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ type: 'join', username, userId }));
    }
  };

  const sendTyping = (username: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ type: 'typing', username, isTyping }));
      
      if (isTyping) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(username, false);
        }, 3000);
      }
    }
  };

  return {
    socket,
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    joinChat,
    sendTyping,
    setMessages
  };
}
