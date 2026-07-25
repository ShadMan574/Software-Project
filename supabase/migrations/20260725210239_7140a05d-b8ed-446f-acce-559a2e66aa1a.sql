DROP POLICY IF EXISTS "Anyone can create admin signup requests" ON public.admin_signups;

CREATE POLICY "Users can create their own admin signup request"
  ON public.admin_signups FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

REVOKE INSERT ON public.admin_signups FROM anon;