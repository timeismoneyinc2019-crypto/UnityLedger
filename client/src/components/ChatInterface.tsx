import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading 
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <Card className="flex flex-col h-full border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Agent Console
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea 
          className="flex-1 p-4" 
          ref={scrollRef}
          data-testid="chat-messages"
        >
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Ask the Nano Agents anything about UnityPay operations.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
                    <span className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
                    <span className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <form 
          onSubmit={handleSubmit}
          className="p-4 border-t border-border/50"
        >
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the agents..."
              disabled={isLoading}
              className="flex-1 bg-muted/30 border-border/50"
              data-testid="chat-input"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isLoading}
              data-testid="chat-send"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  
  return (
    <div 
      className={`flex items-start gap-3 animate-fade-in ${
        isUser ? "flex-row-reverse" : ""
      }`}
      data-testid={`chat-message-${message.id}`}
    >
      <Avatar className={`w-8 h-8 border ${
        isUser ? "border-accent/20" : "border-primary/20"
      }`}>
        <AvatarFallback className={`text-xs ${
          isUser 
            ? "bg-accent/10 text-accent" 
            : "bg-primary/10 text-primary"
        }`}>
          {isUser ? <User className="w-4 h-4" /> : message.agentName?.slice(0, 2) || "AI"}
        </AvatarFallback>
      </Avatar>
      
      <div className={`max-w-[80%] ${isUser ? "text-right" : ""}`}>
        {message.agentName && !isUser && (
          <p className="text-xs font-medium text-primary mb-1">
            {message.agentName}
          </p>
        )}
        <div className={`rounded-2xl px-4 py-2.5 ${
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-muted/50 rounded-tl-sm"
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
