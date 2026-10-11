DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-old-synced-codes') THEN
    PERFORM cron.unschedule('cleanup-old-synced-codes');
  END IF;
END $$;