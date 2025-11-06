import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TeamMember {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export const useTeamMembers = () => {
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email, avatar_url')
        .order('display_name', { ascending: true, nullsFirst: false });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  return {
    teamMembers,
    isLoading
  };
};
