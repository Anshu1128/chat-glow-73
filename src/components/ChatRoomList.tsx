import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, Users, MessageCircle } from "lucide-react";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isActive: boolean;
}

const ChatRoomList = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("chatUsername");

  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: "general",
      name: "General",
      description: "Main discussion room for everyone",
      memberCount: 12,
      isActive: true
    },
    {
      id: "tech-talk",
      name: "Tech Talk",
      description: "Discuss the latest in technology",
      memberCount: 8,
      isActive: true
    },
    {
      id: "random",
      name: "Random",
      description: "Off-topic conversations and fun",
      memberCount: 15,
      isActive: true
    },
    {
      id: "gaming",
      name: "Gaming",
      description: "Gaming discussions and updates",
      memberCount: 6,
      isActive: false
    }
  ]);

  const handleJoinRoom = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  if (!username) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-primary">{username}</span>
          </h1>
          <p className="text-muted-foreground">Choose a chat room to join</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chatRooms.map((room, index) => (
            <Card 
              key={room.id} 
              className={`transition-all duration-300 hover:scale-105 cursor-pointer ${
                room.isActive ? 'glow-primary' : 'opacity-75'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => room.isActive && handleJoinRoom(room.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-primary" />
                    {room.name}
                  </CardTitle>
                  {room.isActive && (
                    <div className="status-online"></div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {room.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {room.memberCount} members
                  </Badge>
                  {room.isActive ? (
                    <Button size="sm" className="animate-pulse">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem("chatUsername");
              navigate("/");
            }}
            className="hover:scale-105 transition-all duration-300"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomList;