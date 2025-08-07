-- Add missing DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Fix nullable user_id in stream_locations and add foreign key constraint
-- First, update any existing NULL user_id records (if any)
UPDATE public.stream_locations 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE public.stream_locations 
ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint to ensure data integrity
ALTER TABLE public.stream_locations 
ADD CONSTRAINT fk_stream_locations_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;