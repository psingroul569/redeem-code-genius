import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, status, published_at, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (!error) setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      loadPosts();
    }
  };

  const statusColor = (s: string) => {
    if (s === "published") return "default";
    if (s === "draft") return "secondary";
    return "outline";
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Posts</h1>
        <Button onClick={() => navigate("/admin/posts/new")} size="sm">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No posts yet.</p>
          <Button onClick={() => navigate("/admin/posts/new")} variant="outline" className="mt-4">Create your first post</Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell><Badge variant={statusColor(post.status)}>{post.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-sm">{new Date(post.updated_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  {post.status === "published" && (
                    <Link to={`/blogs/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/posts/${post.id}`)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PostsList;
