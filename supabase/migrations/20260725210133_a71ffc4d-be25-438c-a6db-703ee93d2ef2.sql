CREATE TABLE public.admin_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  login_email TEXT NOT NULL,
  referral_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.admin_signups TO authenticated;
GRANT SELECT, INSERT ON public.admin_signups TO anon;
GRANT ALL ON public.admin_signups TO service_role;

ALTER TABLE public.admin_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create admin signup requests"
  ON public.admin_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view admin signup records"
  ON public.admin_signups FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));