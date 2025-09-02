import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("chatUsername", username);
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md glow-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ChatFlow
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your username to start chatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="chat-input"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-lg py-6 glow-primary transition-all duration-300 hover:scale-105"
              disabled={!username.trim()}
            >
              Join Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;