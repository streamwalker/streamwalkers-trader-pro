-- Allow anonymous users to view economic events
CREATE POLICY "Public users can view economic events" 
ON public.economic_events FOR SELECT 
TO anon USING (true);

-- Allow anonymous users to view cycle indicators
CREATE POLICY "Public users can view cycle indicators" 
ON public.cycle_indicators FOR SELECT 
TO anon USING (true);

-- Allow anonymous users to view predictions
CREATE POLICY "Public users can view predictions" 
ON public.predictions FOR SELECT 
TO anon USING (true);

-- Allow anonymous users to view sector impacts
CREATE POLICY "Public users can view sector impacts" 
ON public.sector_impacts FOR SELECT 
TO anon USING (true);