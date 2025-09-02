import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, Hash, Users } from "lucide-react";

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface User {
  username: string;
  status: 'online' | 'away';
  avatar: string;
}

const ChatInterface = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const username = localStorage.getItem("chatUsername");

  const [users] = useState<User[]>([
    { username: "Alice", status: "online", avatar: "A" },
    { username: "Bob", status: "online", avatar: "B" },
    { username: "Charlie", status: "away", avatar: "C" },
    { username: "Diana", status: "online", avatar: "D" },
  ]);

  const roomNames: Record<string, string> = {
    general: "General",
    "tech-talk": "Tech Talk",
    random: "Random",
    gaming: "Gaming"
  };

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    // Mock initial messages
    const initialMessages: Message[] = [
      {
        id: "1",
        username: "Alice",
        content: "Hey everyone! How's it going?",
        timestamp: new Date(Date.now() - 300000),
        isOwn: false
      },
      {
        id: "2",
        username: "Bob",
        content: "Great! Just working on some new features.",
        timestamp: new Date(Date.now() - 240000),
        isOwn: false
      },
      {
        id: "3",
        username: "Alice",
        content: "That sounds exciting! What kind of features?",
        timestamp: new Date(Date.now() - 180000),
        isOwn: false
      }
    ];
    setMessages(initialMessages);
  }, [username, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Simulate random messages
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomMessages = [
          "That's a great idea!",
          "I agree with that approach.",
          "Has anyone tried the new update?",
          "Looking forward to the weekend!",
          "Thanks for sharing that resource.",
          "Count me in for the next project!",
          "The weather is amazing today ☀️"
        ];
        
        const newMsg: Message = {
          id: Date.now().toString(),
          username: randomUser.username,
          content: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          isOwn: false
        };
        
        setMessages(prev => [...prev, newMsg]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [users]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      username: username!,
      content: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="chat-sidebar p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/chat")}
            className="hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Hash className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-semibold">{roomNames[roomId!] || roomId}</h1>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {users.length + 1}
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-slide-in-message ${
                  message.isOwn ? "flex-row-reverse" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {message.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={message.isOwn ? "text-right" : ""}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {message.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div
                    className={
                      message.isOwn ? "message-bubble-user" : "message-bubble-other"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-muted">
                    ?
                  </AvatarFallback>
                </Avatar>
                <div className="message-bubble-other typing-indicator">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${roomNames[roomId!] || roomId}`}
                className="chat-input flex-1"
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="glow-primary hover:scale-105 transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Users Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-64 chat-sidebar border-l border-border p-4">
          <h3 className="font-semibold mb-4 text-foreground">Online Users</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">{username} (You)</div>
              </div>
              <div className="status-online"></div>
            </div>
            {users.map((user) => (
              <div key={user.username} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.username}</div>
                </div>
                <div className={user.status === 'online' ? 'status-online' : 'status-away'}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;