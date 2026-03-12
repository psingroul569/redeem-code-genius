import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader2, Trash2, Copy, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text: string;
  created_at: string;
}

const MediaLibrary = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    const { data: { user } } = await supabase.auth.getUser();

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const filename = `${user?.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("media").upload(filename, file);
      if (uploadError) { toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" }); continue; }

      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(filename);

      await supabase.from("media").insert({
        filename, original_name: file.name, mime_type: file.type,
        size: file.size, url: publicUrl, uploaded_by: user?.id,
      });
    }

    toast({ title: "Upload complete" });
    setUploading(false);
    load();
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete ${item.original_name}?`)) return;
    await supabase.storage.from("media").remove([item.filename]);
    await supabase.from("media").delete().eq("id", item.id);
    toast({ title: "Deleted" });
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied" });
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <div>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading} size="sm">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No media files yet. Upload your first file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <CardContent className="p-0">
                {item.mime_type.startsWith("image/") ? (
                  <img src={item.url} alt={item.alt_text || item.original_name} className="w-full h-32 object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-32 bg-muted flex items-center justify-center text-muted-foreground text-xs">{item.mime_type.split("/")[1]?.toUpperCase()}</div>
                )}
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{item.original_name}</p>
                  <p className="text-[10px] text-muted-foreground">{(item.size / 1024).toFixed(1)} KB</p>
                  <div className="flex gap-1 mt-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyUrl(item.url)}><Copy className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(item)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
