import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, Eye, Globe } from "lucide-react";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

interface PostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  visibility: string;
  category_id: string | null;
  featured_image: string;
  seo_title: string;
  seo_description: string;
  seo_canonical: string;
  og_title: string;
  og_description: string;
  og_image: string;
  is_pinned: boolean;
}

interface Category {
  id: string;
  name: string;
}

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

const calculateReadingTime = (content: string) => Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

const PostEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [post, setPost] = useState<PostData>({
    title: "", slug: "", content: "", excerpt: "", status: "draft", visibility: "public",
    category_id: null, featured_image: "", seo_title: "", seo_description: "", seo_canonical: "",
    og_title: "", og_description: "", og_image: "", is_pinned: false,
  });

  useEffect(() => {
    supabase.from("categories").select("id, name").then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    if (isNew) return;
    supabase.from("posts").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error || !data) { navigate("/admin/posts"); return; }
      setPost({
        title: data.title, slug: data.slug, content: data.content || "", excerpt: data.excerpt || "",
        status: data.status, visibility: data.visibility, category_id: data.category_id,
        featured_image: data.featured_image || "", seo_title: data.seo_title || "",
        seo_description: data.seo_description || "", seo_canonical: data.seo_canonical || "",
        og_title: data.og_title || "", og_description: data.og_description || "",
        og_image: data.og_image || "", is_pinned: data.is_pinned || false,
      });
      setLoading(false);
    });
  }, [id, isNew, navigate]);

  const updateField = useCallback((key: keyof PostData, value: any) => {
    setPost((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && (isNew || prev.slug === generateSlug(prev.title))) {
        next.slug = generateSlug(value);
      }
      return next;
    });
  }, [isNew]);

  const handleSave = async (publishNow = false) => {
    if (!post.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    if (!post.slug.trim()) { toast({ title: "Slug is required", variant: "destructive" }); return; }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      ...post,
      status: publishNow ? "published" : post.status,
      published_at: publishNow ? new Date().toISOString() : undefined,
      reading_time: calculateReadingTime(post.content),
      author_id: user?.id,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("posts").insert(payload));
    } else {
      ({ error } = await supabase.from("posts").update(payload).eq("id", id));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: publishNow ? "Published!" : "Saved!" });
      navigate("/admin/posts");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/posts")} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Posts
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
            Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={post.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Post title" className="text-lg font-semibold" />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/blogs/</span>
              <Input value={post.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="post-slug" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Content (Markdown supported)</Label>
            <Textarea value={post.content} onChange={(e) => updateField("content", e.target.value)} placeholder="Write your post content here... Supports Markdown." className="min-h-[400px] font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={post.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} placeholder="Short summary of the post" className="min-h-[80px]" />
          </div>
          <div className="space-y-2">
            <Label>Featured Image URL</Label>
            <Input value={post.featured_image} onChange={(e) => updateField("featured_image", e.target.value)} placeholder="https://..." />
            {post.featured_image && <img src={post.featured_image} alt="Preview" className="w-40 h-24 object-cover rounded-lg border" />}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Search Engine Optimization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input value={post.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} placeholder={post.title || "SEO title"} />
                <p className="text-xs text-muted-foreground">{(post.seo_title || post.title).length}/60 characters</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea value={post.seo_description} onChange={(e) => updateField("seo_description", e.target.value)} placeholder="Meta description for search engines" className="min-h-[60px]" />
                <p className="text-xs text-muted-foreground">{post.seo_description.length}/160 characters</p>
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input value={post.seo_canonical} onChange={(e) => updateField("seo_canonical", e.target.value)} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Open Graph</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OG Title</Label>
                <Input value={post.og_title} onChange={(e) => updateField("og_title", e.target.value)} placeholder={post.title || "OG title"} />
              </div>
              <div className="space-y-2">
                <Label>OG Description</Label>
                <Textarea value={post.og_description} onChange={(e) => updateField("og_description", e.target.value)} placeholder="OG description" className="min-h-[60px]" />
              </div>
              <div className="space-y-2">
                <Label>OG Image URL</Label>
                <Input value={post.og_image} onChange={(e) => updateField("og_image", e.target.value)} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={post.category_id || ""} onValueChange={(v) => updateField("category_id", v || null)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={post.status} onValueChange={(v) => updateField("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={post.visibility} onValueChange={(v) => updateField("visibility", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={post.is_pinned} onCheckedChange={(v) => updateField("is_pinned", v)} />
                <Label>Pin this post</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostEditor;
