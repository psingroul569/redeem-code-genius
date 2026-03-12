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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, Globe } from "lucide-react";

const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

const PageEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState({
    title: "", slug: "", content: "", status: "draft",
    seo_title: "", seo_description: "", seo_canonical: "",
    og_title: "", og_description: "", og_image: "", template: "default", sort_order: 0,
  });

  useEffect(() => {
    if (isNew) return;
    supabase.from("pages").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error || !data) { navigate("/admin/pages"); return; }
      setPage({
        title: data.title, slug: data.slug, content: data.content || "", status: data.status,
        seo_title: data.seo_title || "", seo_description: data.seo_description || "",
        seo_canonical: data.seo_canonical || "", og_title: data.og_title || "",
        og_description: data.og_description || "", og_image: data.og_image || "",
        template: data.template || "default", sort_order: data.sort_order || 0,
      });
      setLoading(false);
    });
  }, [id, isNew, navigate]);

  const updateField = useCallback((key: string, value: any) => {
    setPage((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && (isNew || prev.slug === generateSlug(prev.title))) next.slug = generateSlug(value);
      return next;
    });
  }, [isNew]);

  const handleSave = async (publishNow = false) => {
    if (!page.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      ...page, status: publishNow ? "published" : page.status,
      published_at: publishNow ? new Date().toISOString() : undefined,
      author_id: user?.id,
    };

    let error;
    if (isNew) ({ error } = await supabase.from("pages").insert(payload));
    else ({ error } = await supabase.from("pages").update(payload).eq("id", id));

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: publishNow ? "Published!" : "Saved!" }); navigate("/admin/pages"); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/pages")} className="gap-2"><ArrowLeft className="w-4 h-4" /> Pages</Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />} Publish
          </Button>
        </div>
      </div>
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="space-y-2"><Label>Title</Label><Input value={page.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Page title" className="text-lg font-semibold" /></div>
          <div className="space-y-2"><Label>Slug</Label><Input value={page.slug} onChange={(e) => updateField("slug", e.target.value)} /></div>
          <div className="space-y-2"><Label>Content</Label><Textarea value={page.content} onChange={(e) => updateField("content", e.target.value)} placeholder="Page content... Supports Markdown." className="min-h-[400px] font-mono text-sm" /></div>
          <div className="space-y-2"><Label>Status</Label>
            <Select value={page.status} onValueChange={(v) => updateField("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
            </Select>
          </div>
        </TabsContent>
        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>SEO Title</Label><Input value={page.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} /></div>
              <div className="space-y-2"><Label>Meta Description</Label><Textarea value={page.seo_description} onChange={(e) => updateField("seo_description", e.target.value)} className="min-h-[60px]" /></div>
              <div className="space-y-2"><Label>Canonical URL</Label><Input value={page.seo_canonical} onChange={(e) => updateField("seo_canonical", e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageEditor;
