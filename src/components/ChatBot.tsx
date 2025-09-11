import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "Hey there! I'm Tommy. Feel free to ask me anything about my background, experience, or interests. What would you like to know?",
    isUser: false,
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const {
    toast
  } = useToast();

  // AI-powered response using OpenAI
  const getAIResponse = async (question: string): Promise<string> => {
    try {
      console.log('Sending message to AI:', question);
      const {
        data,
        error
      } = await supabase.functions.invoke('chat-with-tommy', {
        body: {
          message: question
        }
      });
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      console.log('Received AI response:', data);
      return data.response || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Error calling AI:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI assistant. Please try again.",
        variant: "destructive"
      });
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  };
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputValue.trim();
    setInputValue("");
    setIsTyping(true);
    try {
      const response = await getAIResponse(currentMessage);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    } finally {
      setIsTyping(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return <section className="py-12 px-6 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ask Me Anything
          </h2>
          <p className="text-muted-foreground text-lg">Have questions about my experience, projects, or interests?</p>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card">
          <CardContent className="p-0">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map(message => <div key={message.id} className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  {!message.isUser && <Avatar className="w-8 h-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>}
                  
                  <div className={`max-w-[80%] p-3 rounded-2xl transition-all duration-300 ${message.isUser ? 'bg-primary text-primary-foreground ml-12' : 'bg-muted text-muted-foreground'}`}>
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-ul:text-inherit prose-li:text-inherit">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                  
                  {message.isUser && <Avatar className="w-8 h-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-accent/10 text-accent">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>}
                </div>)}
              
              {isTyping && <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>}
            </div>
            
            {/* Input Area */}
            <div className="p-6 border-t border-border/50">
              <div className="flex gap-3">
                <Input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask about Tommy's experience, projects, or interests..." className="flex-1 border-primary/20 focus:border-primary bg-background/50" />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default ChatBot;