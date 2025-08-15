-- Fix security issues: Set search path for functions and remove SECURITY DEFINER from view

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.obfuscate_coordinates(lat double precision, lng double precision)
RETURNS TABLE(obfuscated_lat double precision, obfuscated_lng double precision)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Round to ~3 decimal places for ~100m accuracy, then add random offset for ~1km area
  RETURN QUERY SELECT 
    ROUND(lat::numeric, 2)::double precision + (RANDOM() - 0.5) * 0.01,
    ROUND(lng::numeric, 2)::double precision + (RANDOM() - 0.5) * 0.01;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_obfuscated_location()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  obfuscated_coords RECORD;
BEGIN
  -- Only obfuscate if user has given consent and is live
  IF NEW.location_consent = true AND NEW.is_live = true THEN
    SELECT * INTO obfuscated_coords FROM public.obfuscate_coordinates(NEW.latitude, NEW.longitude);
    NEW.approximate_latitude := obfuscated_coords.obfuscated_lat;
    NEW.approximate_longitude := obfuscated_coords.obfuscated_lng;
  ELSE
    NEW.approximate_latitude := NULL;
    NEW.approximate_longitude := NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate view without SECURITY DEFINER (make it a regular view)
DROP VIEW IF EXISTS public.public_stream_locations;
CREATE VIEW public.public_stream_locations AS
SELECT 
  id,
  stream_title,
  approximate_latitude as latitude,
  approximate_longitude as longitude,
  is_live,
  last_updated_at
FROM public.stream_locations
WHERE is_live = true 
  AND location_consent = true 
  AND approximate_latitude IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON public.public_stream_locations TO anon, authenticated;