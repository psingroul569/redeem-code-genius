-- Web Push subscriptions for "new code" alerts — a zero-maintenance way to
-- notify users the instant a code syncs, without running a Discord/Telegram
-- community that needs daily moderation.

CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'GLOBAL',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_notified_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_push_subscriptions_region ON public.push_subscriptions (region);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscriptions are write-only from the client's perspective (via the
-- push-subscribe edge function using the service role) — no anon SELECT,
-- since endpoint/keys are sensitive push credentials, not public data.
CREATE POLICY "Service role manages push subscriptions"
  ON public.push_subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
