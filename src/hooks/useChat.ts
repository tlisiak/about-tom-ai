import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { getVisitorId, createVisitorClient } from '@/lib/supabaseWithVisitor';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  welcomeMessage?: string;
  storageKey?: string;
}

export const useChat = ({ welcomeMessage, storageKey = 'tommy-chat-history' }: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const visitorId = useRef(getVisitorId());
  const initialLoadDone = useRef(false);
  
  // Create visitor-aware Supabase client for RLS
  const supabase = useMemo(() => createVisitorClient(visitorId.current), []);

  // Load messages from database on mount
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    const loadConversation = async () => {
      try {
        // Check for existing conversation
        const { data: conversations } = await supabase
          .from('conversations')
          .select('id')
          .eq('visitor_id', visitorId.current)
          .order('last_message_at', { ascending: false })
          .limit(1);

        if (conversations && conversations.length > 0) {
          conversationIdRef.current = conversations[0].id;
          
          // Load messages for this conversation
          const { data: dbMessages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversations[0].id)
            .order('created_at', { ascending: true });

          if (dbMessages && dbMessages.length > 0) {
            const loadedMessages: Message[] = dbMessages.map(m => ({
              id: m.id,
              role: m.role as 'user' | 'assistant',
              content: m.content,
              timestamp: new Date(m.created_at),
            }));
            setMessages(loadedMessages);
            return;
          }
        }

        // No existing conversation or messages - show welcome
        if (welcomeMessage) {
          setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date(),
          }]);
        }
      } catch (e) {
        console.error('Failed to load conversation:', e);
        // Fallback to session storage
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setMessages(parsed.map((m: Message) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })));
          } catch {
            if (welcomeMessage) {
              setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: welcomeMessage,
                timestamp: new Date(),
              }]);
            }
          }
        } else if (welcomeMessage) {
          setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date(),
          }]);
        }
      }
    };

    loadConversation();
  }, [storageKey, welcomeMessage]);

  // Save messages to session storage as backup
  useEffect(() => {
    if (messages.length > 0 && messages[0].id !== 'welcome') {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  const saveMessageToDb = useCallback(async (message: Message) => {
    try {
      // Create conversation if needed
      if (!conversationIdRef.current) {
        const { data: newConvo } = await supabase
          .from('conversations')
          .insert({ visitor_id: visitorId.current })
          .select('id')
          .single();
        
        if (newConvo) {
          conversationIdRef.current = newConvo.id;
        }
      }

      if (conversationIdRef.current && message.id !== 'welcome') {
        // Save message
        await supabase.from('messages').insert({
          conversation_id: conversationIdRef.current,
          role: message.role,
          content: message.content,
        });

        // Update last_message_at
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationIdRef.current);
      }
    } catch (e) {
      console.error('Failed to save message:', e);
    }
  }, []);

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

    // Save user message to DB
    saveMessageToDb(userMessage);

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

      // Save completed assistant message to DB
      if (assistantContent) {
        saveMessageToDb({
          id: assistantId,
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date(),
        });
      }

    } catch (e) {
      console.error('Chat error:', e);
      setError(e instanceof Error ? e.message : 'Failed to send message');
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(m => m.content !== ''));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, saveMessageToDb]);

  const clearHistory = useCallback(async () => {
    sessionStorage.removeItem(storageKey);
    
    // Delete conversation from DB
    if (conversationIdRef.current) {
      try {
        await supabase
          .from('conversations')
          .delete()
          .eq('id', conversationIdRef.current);
      } catch (e) {
        console.error('Failed to delete conversation:', e);
      }
      conversationIdRef.current = null;
    }
    
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
