import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

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
            : "bg-white/25 text-white border border-white/25 backdrop-blur-sm mr-8"
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:my-2 prose-a:text-primary-foreground prose-a:underline">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
