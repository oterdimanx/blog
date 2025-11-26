import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, FileText, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Admin = () => {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const { data: posts, isLoading } = useBlogPosts(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/auth");
    }
  }, [isAdmin, loading, user, navigate]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    }
  };

  if (loading || !isAdmin) {
    return null;
  }

  const publishedCount = posts?.filter((p) => p.is_published).length || 0;
  const draftCount = posts?.filter((p) => !p.is_published).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your blog posts</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/">
                  <Eye className="w-4 h-4 mr-2" />
                  View Site
                </Link>
              </Button>
              <Button asChild>
                <Link to="/admin/post/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Posts</CardTitle>
              <CardDescription>All blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{posts?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Published</CardTitle>
              <CardDescription>Live posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{publishedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Drafts</CardTitle>
              <CardDescription>Unpublished posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{draftCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <CardDescription>Manage your blog content</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{post.title}</h3>
                        <Badge variant={post.is_published ? "default" : "secondary"}>
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.reading_time} min read</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/admin/post/${post.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No posts yet. Create your first post to get started!
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
