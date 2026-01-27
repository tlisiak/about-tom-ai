-- Enforce chat message immutability by explicitly denying UPDATE and DELETE
-- (RLS is enabled; without explicit policies, UPDATE/DELETE are denied by default,
--  but we add explicit restrictive policies to make the intent auditable.)

CREATE POLICY "messages_deny_update"
ON public.messages
FOR UPDATE
TO public
USING (false);

CREATE POLICY "messages_deny_delete"
ON public.messages
FOR DELETE
TO public
USING (false);
