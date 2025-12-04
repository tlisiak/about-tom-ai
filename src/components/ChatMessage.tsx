import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLatest?: boolean;
  onSpeak?: () => void;
  onStopSpeaking?: () => void;
  isSpeaking?: boolean;
  canSpeak?: boolean;
}

const ChatMessage = ({ 
  role, 
  content, 
  isLatest,
  onSpeak,
  onStopSpeaking,
  isSpeaking,
  canSpeak,
}: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        "flex w-full mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-md",
          isUser 
            ? "bg-primary/90 text-primary-foreground ml-8" 
            : "bg-white/15 text-white border border-white/20 backdrop-blur-sm mr-8"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
        
        {/* TTS button for assistant messages */}
        {!isUser && canSpeak && content && (
          <div className="flex justify-end mt-2 -mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={isSpeaking ? onStopSpeaking : onSpeak}
              className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
              aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
            >
              {isSpeaking ? (
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
