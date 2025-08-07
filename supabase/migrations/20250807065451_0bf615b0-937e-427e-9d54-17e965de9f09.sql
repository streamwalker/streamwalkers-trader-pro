-- Fix database security issues identified in the security review

-- 1. Fix profiles table RLS policies - add missing INSERT policy
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Update existing function to use proper search_path (security fix)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, created_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'avatar_url', now());
  RETURN new;
END;
$function$;

-- 3. Update the other function to use proper search_path
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
    NEW.last_updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- 4. Create trigger for profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_new_user();
    END IF;
END
$$;