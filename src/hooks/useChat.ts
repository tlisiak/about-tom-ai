import { useState, useCallback, useEffect } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  endpoint: string;
  welcomeMessage?: string;
  storageKey?: string;
}

export const useChat = ({ endpoint, welcomeMessage, storageKey = 'tommy-chat-history' }: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages from session storage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMessages(parsed.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
      } catch (e) {
        console.error('Failed to parse stored messages:', e);
      }
    } else if (welcomeMessage) {
      // Add welcome message if no history
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [storageKey, welcomeMessage]);

  // Save messages to session storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Prepare messages for API (exclude welcome message)
    const apiMessages = [...messages, userMessage]
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const chatUrl = `${supabaseUrl}/functions/v1/chat`;
      
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const assistantId = `assistant-${Date.now()}`;
      let assistantContent = '';

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => prev.map(m => 
                  m.id === assistantId 
                    ? { ...m, content: assistantContent }
                    : m
                ));
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
      }

    } catch (e) {
      console.error('Chat error:', e);
      setError(e instanceof Error ? e.message : 'Failed to send message');
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(m => m.content !== ''));
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, messages, isLoading]);

  const clearHistory = useCallback(() => {
    sessionStorage.removeItem(storageKey);
    setMessages(welcomeMessage ? [{
      id: 'welcome',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
    }] : []);
  }, [storageKey, welcomeMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  };
};
