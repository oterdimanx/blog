import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_avatar: string | null;
  published_at: string;
  reading_time: number;
  category: string;
  tags: string[];
  cover_image: string | null;
  is_published: boolean;
}

export const useBlogPosts = (includeUnpublished = false) => {
  return useQuery({
    queryKey: ["blog_posts", includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (!includeUnpublished) {
        query = query.eq("is_published", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ["blog_post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!id,
  });
};