
-- Fix 1: Drop all anon write policies on newsroom tables
DROP POLICY IF EXISTS "anon_insert_sources" ON newsroom_sources;
DROP POLICY IF EXISTS "anon_update_sources" ON newsroom_sources;
DROP POLICY IF EXISTS "anon_delete_sources" ON newsroom_sources;

DROP POLICY IF EXISTS "anon_insert_signals" ON newsroom_signals;
DROP POLICY IF EXISTS "anon_update_signals" ON newsroom_signals;
DROP POLICY IF EXISTS "anon_delete_signals" ON newsroom_signals;

DROP POLICY IF EXISTS "anon_insert_articles" ON newsroom_articles;
DROP POLICY IF EXISTS "anon_update_articles" ON newsroom_articles;
DROP POLICY IF EXISTS "anon_delete_articles" ON newsroom_articles;

DROP POLICY IF EXISTS "anon_insert_publish_rules" ON newsroom_publish_rules;
DROP POLICY IF EXISTS "anon_update_publish_rules" ON newsroom_publish_rules;
DROP POLICY IF EXISTS "anon_delete_publish_rules" ON newsroom_publish_rules;

DROP POLICY IF EXISTS "anon_insert_watchlists" ON newsroom_watchlists;
DROP POLICY IF EXISTS "anon_update_watchlists" ON newsroom_watchlists;
DROP POLICY IF EXISTS "anon_delete_watchlists" ON newsroom_watchlists;

DROP POLICY IF EXISTS "anon_insert_audit_logs" ON newsroom_audit_logs;
DROP POLICY IF EXISTS "anon_update_audit_logs" ON newsroom_audit_logs;
DROP POLICY IF EXISTS "anon_delete_audit_logs" ON newsroom_audit_logs;

DROP POLICY IF EXISTS "anon_insert_article_updates" ON newsroom_article_updates;
DROP POLICY IF EXISTS "anon_update_article_updates" ON newsroom_article_updates;
DROP POLICY IF EXISTS "anon_delete_article_updates" ON newsroom_article_updates;

DROP POLICY IF EXISTS "anon_insert_cluster_signals" ON newsroom_cluster_signals;
DROP POLICY IF EXISTS "anon_delete_cluster_signals" ON newsroom_cluster_signals;

-- Fix 2: Drop overly permissive public policy on subscribers table and add service_role-only write
DROP POLICY IF EXISTS "System can manage subscriptions" ON subscribers;
CREATE POLICY "Service role manages subscriptions" ON subscribers
  FOR ALL TO service_role USING (true) WITH CHECK (true);
