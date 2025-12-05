-- Drop existing permissive policies
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
DROP POLICY IF EXISTS "conversations_update" ON public.conversations;
DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;

-- Create function to get visitor_id from request headers
CREATE OR REPLACE FUNCTION public.get_visitor_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::json->>'x-visitor-id',
    ''
  );
$$;

-- Conversations: Visitors can only see their own conversations
CREATE POLICY "conversations_select_own"
ON public.conversations
FOR SELECT
USING (visitor_id = public.get_visitor_id());

-- Conversations: Visitors can insert with their own visitor_id
CREATE POLICY "conversations_insert_own"
ON public.conversations
FOR INSERT
WITH CHECK (visitor_id = public.get_visitor_id());

-- Conversations: Visitors can update only their own conversations
CREATE POLICY "conversations_update_own"
ON public.conversations
FOR UPDATE
USING (visitor_id = public.get_visitor_id())
WITH CHECK (visitor_id = public.get_visitor_id());

-- Messages: Visitors can only see messages from their own conversations
CREATE POLICY "messages_select_own"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND c.visitor_id = public.get_visitor_id()
  )
);

-- Messages: Visitors can insert messages only to their own conversations
CREATE POLICY "messages_insert_own"
ON public.messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND c.visitor_id = public.get_visitor_id()
  )
);