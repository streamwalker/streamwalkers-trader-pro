-- Fix security warning: Set search_path for get_cron_jobs function
CREATE OR REPLACE FUNCTION get_cron_jobs()
RETURNS TABLE (
  jobid bigint,
  jobname text,
  schedule text,
  active boolean,
  command text
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    jobid,
    jobname,
    schedule,
    active,
    command
  FROM cron.job
  ORDER BY jobid DESC;
$$;

-- Fix security warning: Set search_path for toggle_cron_job function
CREATE OR REPLACE FUNCTION toggle_cron_job(job_id bigint, is_active boolean)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE cron.job
  SET active = is_active
  WHERE jobid = job_id;
$$;