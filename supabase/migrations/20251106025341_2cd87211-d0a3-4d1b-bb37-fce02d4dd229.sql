-- Create function to get cron jobs
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

-- Create function to toggle cron job status
CREATE OR REPLACE FUNCTION toggle_cron_job(job_id bigint, is_active boolean)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE cron.job
  SET active = is_active
  WHERE jobid = job_id;
$$;