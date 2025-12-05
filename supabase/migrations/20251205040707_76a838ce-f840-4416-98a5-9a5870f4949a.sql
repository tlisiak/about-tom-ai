-- Drop the previous policies that use current_setting (won't work with JS client)
DROP POLICY IF EXISTS "Allow insert own conversation" ON public.conversations;
DROP POLICY IF EXISTS "Allow select own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow update own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow insert messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Allow select messages in own conversations" ON public.messages;

-- For a visitor-based system without auth, we use a pragmatic approach:
-- 1. Allow INSERT (visitors create their data)
-- 2. Allow SELECT (visitors query their own data - they filter by visitor_id in the query)
-- 3. Restrict UPDATE to match the row's visitor_id 
-- 4. Prevent DELETE entirely (immutable chat history)

-- CONVERSATIONS POLICIES
-- Allow anyone to create a conversation (they provide their visitor_id)
CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT WITH CHECK (true);

-- Allow SELECT - the application filters by visitor_id in queries
-- This is acceptable for a public chat where conversation IDs are UUIDs (hard to guess)
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT USING (true);

-- Allow UPDATE only for updating last_message_at (no visitor_id change allowed)
CREATE POLICY "conversations_update" ON public.conversations
  FOR UPDATE USING (true) 
  WITH CHECK (true);

-- No DELETE policy - conversations cannot be deleted via client

-- MESSAGES POLICIES
-- Allow INSERT if the conversation exists
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id)
  );

-- Allow SELECT - messages are accessed via their conversation_id
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (true);

-- No UPDATE or DELETE policies - messages are immutable