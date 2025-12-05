-- Create conversations table for chat persistence
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups by visitor_id
CREATE INDEX idx_conversations_visitor_id ON public.conversations(visitor_id);

-- Create index for faster message lookups by conversation
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous visitor access (public site, no auth)
CREATE POLICY "Allow public conversation access" ON public.conversations
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public message access" ON public.messages
  FOR ALL USING (true) WITH CHECK (true);