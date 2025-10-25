-- Fix user_roles RLS policies by splitting ALL policy into explicit policies
-- This prevents potential privilege escalation if has_role() function fails

-- Drop the existing ALL policy
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create separate policies for each operation with explicit WITH CHECK conditions
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add database-level validation constraints for contact_submissions
-- This prevents malformed data and excessively long strings

ALTER TABLE public.contact_submissions
ADD CONSTRAINT contact_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
ADD CONSTRAINT contact_email_length CHECK (char_length(email) BETWEEN 3 AND 255),
ADD CONSTRAINT contact_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT contact_project_length CHECK (char_length(project) BETWEEN 1 AND 2000);