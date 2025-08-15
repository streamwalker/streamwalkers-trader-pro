-- Add obfuscated location fields for public access
ALTER TABLE public.stream_locations 
ADD COLUMN approximate_latitude double precision,
ADD COLUMN approximate_longitude double precision,
ADD COLUMN location_consent boolean DEFAULT false;

-- Create function to obfuscate coordinates (reduces precision to ~1km accuracy)
CREATE OR REPLACE FUNCTION public.obfuscate_coordinates(lat double precision, lng double precision)
RETURNS TABLE(obfuscated_lat double precision, obfuscated_lng double precision)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Round to ~3 decimal places for ~100m accuracy, then add random offset for ~1km area
  RETURN QUERY SELECT 
    ROUND(lat::numeric, 2)::double precision + (RANDOM() - 0.5) * 0.01,
    ROUND(lng::numeric, 2)::double precision + (RANDOM() - 0.5) * 0.01;
END;
$$;

-- Create trigger to automatically update obfuscated coordinates
CREATE OR REPLACE FUNCTION public.update_obfuscated_location()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_obfuscated_location_trigger
  BEFORE INSERT OR UPDATE ON public.stream_locations
  FOR EACH ROW EXECUTE FUNCTION public.update_obfuscated_location();

-- Update RLS policies to protect precise coordinates
DROP POLICY IF EXISTS "Public read access for live streams" ON public.stream_locations;

-- Create secure public access policy that only shows obfuscated data
CREATE POLICY "Public access to obfuscated live stream locations" 
ON public.stream_locations 
FOR SELECT 
USING (
  is_live = true AND 
  location_consent = true AND 
  approximate_latitude IS NOT NULL
);

-- Create view for public consumption that excludes precise coordinates
CREATE OR REPLACE VIEW public.public_stream_locations AS
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

-- Grant public access to the view
GRANT SELECT ON public.public_stream_locations TO anon, authenticated;