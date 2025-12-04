import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";

const THINKING_PHRASES = [
  "Tommy's thinking really hard",
  "Hmmmmm let me think",
  "One sec, consulting my brain",
  "Digging through my memories",
  "Processing... beep boop 🤖",
  "Ah, good question!",
  "Let me check my notes",
  "Tommy.exe is loading",
  "Brewing up a response ☕",
  "Hold on, neurons firing",
];

interface ChatWidgetProps {
  endpoint: string;
  title: string;
  welcome: string;
  onClose: () => void;
}

const ChatWidget = ({ 
  endpoint, 
  title, 
  welcome, 
  onClose 
}: ChatWidgetProps) => {
  const [input, setInput] = useState("");
  const [thinkingPhrase, setThinkingPhrase] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, error, sendMessage, clearHistory } = useChat({
    endpoint,
    welcomeMessage: welcome,
  });

  // Pick random thinking phrase when loading starts
  useEffect(() => {
    if (isLoading) {
      const randomIndex = Math.floor(Math.random() * THINKING_PHRASES.length);
      setThinkingPhrase(THINKING_PHRASES[randomIndex]);
    }
  }, [isLoading]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  }, [input, isLoading, sendMessage]);

  // Check if we should show thinking indicator
  const lastMessage = messages[messages.length - 1];
  const showThinking = isLoading && (!lastMessage || lastMessage.role === 'user' || lastMessage.content === '');

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-[520px] md:h-[580px] w-full"
      role="dialog"
      aria-label={title}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 -ml-2"
            aria-label="Close chat and return to hero"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-white/60 hover:text-white hover:bg-white/10"
          aria-label="Clear chat history"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </header>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
        
        {/* Thinking indicator */}
        {showThinking && (
          <div className="flex justify-start mb-3">
            <div className="bg-white/15 text-white border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 mr-8">
              <div className="flex flex-col items-start gap-1.5">
                <span className="text-sm text-white/80">{thinkingPhrase}</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="flex justify-center mb-3">
            <div className="bg-destructive/20 text-destructive-foreground border border-destructive/30 rounded-xl px-4 py-2 text-sm">
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <footer className="border-t border-white/20 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about my work or background..."
            disabled={isLoading}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-50 transition-all"
            aria-label="Type your message"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 disabled:opacity-50 transition-all"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWidget;
