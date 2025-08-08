import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useWebSocket } from '@/hooks/use-websocket';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

export function ChatArea() {
  const [messageInput, setMessageInput] = useState('');
  const [username] = useState(`User_${Math.random().toString(36).substring(7)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    isConnected, 
    messages, 
    onlineUsers, 
    typingUsers, 
    sendMessage, 
    joinChat, 
    sendTyping,
    setMessages 
  } = useWebSocket();

  // Fetch initial messages
  const { data: initialMessages } = useQuery({
    queryKey: ['/api/messages'],
    queryFn: async () => {
      const response = await fetch('/api/messages?channel=general&limit=50');
      return response.json();
    },
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  useEffect(() => {
    if (isConnected) {
      joinChat(username);
    }
  }, [isConnected, username, joinChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && isConnected) {
      sendMessage({
        content: messageInput.trim(),
        username,
        channel: 'general'
      });
      setMessageInput('');
      sendTyping(username, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value.length > 0) {
      sendTyping(username, true);
    } else {
      sendTyping(username, false);
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="flex-1 flex flex-col glassmorphism">
      {/* Chat Header */}
      <div className="glassmorphism border-b border-white border-opacity-10 p-4">
        <h2 className="text-white text-xl font-semibold" data-testid="chat-title">
          一般チャンネル
        </h2>
        <p className="text-white opacity-70 text-sm" data-testid="online-count">
          {onlineUsers.length}人がオンライン
          {!isConnected && ' (接続中...)'}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto" data-testid="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className="mb-4 glassmorphism-light rounded-lg p-3 backdrop-blur-sm"
            data-testid={`message-${message.id}`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 glassmorphism-light rounded-full flex items-center justify-center">
                <span className="text-xs text-white">
                  {message.username.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-white font-medium" data-testid={`username-${message.id}`}>
                {message.username}
              </span>
              <span className="text-white opacity-50 text-xs" data-testid={`timestamp-${message.id}`}>
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            <p className="text-white" data-testid={`content-${message.id}`}>
              {message.content}
            </p>
          </div>
        ))}
        
        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="glassmorphism-light rounded-lg p-3 opacity-70" data-testid="typing-indicator">
            <p className="text-white text-sm">
              {typingUsers.join(', ')} が入力中...
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="glassmorphism border-t border-white border-opacity-10 p-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="メッセージを入力..."
            value={messageInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 glassmorphism-light border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60"
            data-testid="message-input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !isConnected}
            className="bg-river-blue hover:bg-river-light text-white font-medium"
            data-testid="send-button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
