export interface ChatMessage {
  id: string;
  content: string;
  username: string;
  timestamp: Date;
  channel: string;
  userId: string;
}

export interface User {
  id: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface WebSocketMessage {
  type: 'join' | 'message' | 'typing' | 'userJoined' | 'userLeft' | 'newMessage' | 'userTyping';
  content?: string;
  username?: string;
  userId?: string;
  channel?: string;
  message?: ChatMessage;
  isTyping?: boolean;
  onlineUsers?: User[];
}
