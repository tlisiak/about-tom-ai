-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow public conversation access" ON public.conversations;
DROP POLICY IF EXISTS "Allow public message access" ON public.messages;

-- Create restrictive policies for conversations table
-- Visitors can only INSERT new conversations (they provide their visitor_id)
CREATE POLICY "Allow insert own conversation" ON public.conversations
  FOR INSERT WITH CHECK (true);

-- Visitors can only SELECT their own conversations
CREATE POLICY "Allow select own conversations" ON public.conversations
  FOR SELECT USING (visitor_id = current_setting('app.visitor_id', true));

-- Visitors can only UPDATE their own conversations  
CREATE POLICY "Allow update own conversations" ON public.conversations
  FOR UPDATE USING (visitor_id = current_setting('app.visitor_id', true));

-- No DELETE allowed for conversations (preserve chat history)
-- If needed later: CREATE POLICY "Allow delete own conversations" ON public.conversations
--   FOR DELETE USING (visitor_id = current_setting('app.visitor_id', true));

-- Create restrictive policies for messages table
-- Allow INSERT for messages in conversations the visitor owns
CREATE POLICY "Allow insert messages in own conversations" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id 
      AND visitor_id = current_setting('app.visitor_id', true)
    )
  );

-- Allow SELECT for messages in conversations the visitor owns
CREATE POLICY "Allow select messages in own conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id 
      AND visitor_id = current_setting('app.visitor_id', true)
    )
  );

-- No UPDATE or DELETE for messages (chat history is immutable)