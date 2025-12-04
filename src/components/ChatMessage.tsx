import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
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
      </div>
    </div>
  );
};

export default ChatMessage;
