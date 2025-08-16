import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Tommy's AI assistant. Feel free to ask me anything about Tommy's background, experience, or interests. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Pre-defined responses based on Tommy's background
  const getResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes("experience") || q.includes("background") || q.includes("work")) {
      return "Tommy has extensive experience in product leadership across climate tech companies. He's currently Head of Product at Scout (AI-powered tools for funding), previously worked at Inspire Clean Energy (acquired by Shell), Washington Post's Zeus Technology, and Arcadia (now a unicorn startup). He's led teams of 10+ engineers and launched multiple successful products.";
    }
    
    if (q.includes("scout") || q.includes("current") || q.includes("job")) {
      return "Tommy is currently the Head of Product at Scout, where they're building AI-powered tools to help socially responsible businesses win non-dilutive funding. Scout combines expert grant writers with intelligent software to streamline the grant discovery, writing, and collaboration process.";
    }
    
    if (q.includes("climate") || q.includes("sustainability") || q.includes("environment")) {
      return "Tommy is passionate about climate tech and sustainability. At Inspire Clean Energy, his work contributed to diverting over 5.6 billion pounds of CO₂e. He focuses on blending innovation with sustainability to drive impactful change in everything he builds.";
    }
    
    if (q.includes("leadership") || q.includes("team") || q.includes("manage")) {
      return "Tommy's leadership approach balances operational excellence with strategic vision. He believes in fostering strong collaboration, clarity, and motivation to create environments where people can do their most innovative work. He's led teams of 10+ engineers and scaled products from startups to enterprise level.";
    }
    
    if (q.includes("webby") || q.includes("award") || q.includes("voice") || q.includes("alexa")) {
      return "Earlier in his career, Tommy explored voice AI, building dozens of products for Amazon Alexa and Google Assistant. He partnered with Fortune 500 companies and won a Webby Award for his work on 'Bravo Tango Brain Training' in the Best Use of Machine Learning category.";
    }
    
    if (q.includes("hobby") || q.includes("interest") || q.includes("soccer") || q.includes("personal")) {
      return "Outside of work, Tommy is passionate about soccer and you'll often catch him wearing his Vans Classics. He approaches challenges with curiosity, excitement, and empathy, and he's usually smiling whether on Zoom or in the office!";
    }
    
    if (q.includes("contact") || q.includes("reach") || q.includes("email") || q.includes("linkedin")) {
      return "You can reach Tommy via email at tommylisiak@gmail.com or connect with him on LinkedIn at linkedin.com/in/tommylisiak/. He's always open to connecting with fellow innovators and discussing opportunities in climate tech!";
    }
    
    if (q.includes("education") || q.includes("school") || q.includes("university")) {
      return "While I don't have specific details about Tommy's educational background in my knowledge base, his extensive experience across product leadership roles at top companies like those acquired by Shell and his technical expertise suggest strong educational foundations. Feel free to ask him directly for more details!";
    }
    
    if (q.includes("inspire") || q.includes("shell")) {
      return "At Inspire Clean Energy (acquired by Shell), Tommy spearheaded the modernization of their digital tech stack, leading to a 100+% increase in web conversion rates and enhanced user experience. His work contributed to diverting over 5.6 billion pounds of CO₂e.";
    }
    
    if (q.includes("arcadia") || q.includes("utility") || q.includes("data")) {
      return "At Arcadia (now a startup unicorn), Tommy led the development of over 200 utility data acquisition services, empowering clean energy adoption across the U.S. Think of it as Plaid, but for utilities—unlocking access to energy data for climate innovators.";
    }
    
    // Default response
    return "That's a great question! While I have information about Tommy's professional background in product leadership and climate tech, I might not have specific details about that topic. I'd recommend reaching out to Tommy directly at tommylisiak@gmail.com or on LinkedIn for more personalized insights. Is there anything else about his experience at Scout, climate tech work, or product leadership that I can help with?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getResponse(inputValue.trim());
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ask Me Anything
          </h2>
          <p className="text-muted-foreground text-lg">
            Have questions about my experience, projects, or interests? Chat with my AI assistant!
          </p>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card">
          <CardContent className="p-0">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <Avatar className="w-8 h-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl transition-all duration-300 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground ml-12'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  
                  {message.isUser && (
                    <Avatar className="w-8 h-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-accent/10 text-accent">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
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
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-6 border-t border-border/50">
              <div className="flex gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Tommy's experience, projects, or interests..."
                  className="flex-1 border-primary/20 focus:border-primary bg-background/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ChatBot;