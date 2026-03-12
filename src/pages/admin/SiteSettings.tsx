import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SETTINGS_KEYS = [
  { key: "site_name", label: "Site Name", type: "text" },
  { key: "site_description", label: "Site Description", type: "textarea" },
  { key: "site_logo", label: "Logo URL", type: "text" },
  { key: "contact_email", label: "Contact Email", type: "text" },
  { key: "social_twitter", label: "Twitter URL", type: "text" },
  { key: "social_discord", label: "Discord URL", type: "text" },
  { key: "social_youtube", label: "YouTube URL", type: "text" },
  { key: "footer_text", label: "Footer Text", type: "textarea" },
  { key: "default_seo_title", label: "Default SEO Title", type: "text" },
  { key: "default_seo_description", label: "Default Meta Description", type: "textarea" },
  { key: "google_analytics_id", label: "Google Analytics ID", type: "text" },
  { key: "adsense_publisher_id", label: "AdSense Publisher ID", type: "text" },
];

const SiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((row) => { map[row.key] = row.value || ""; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const s of SETTINGS_KEYS) {
      const value = settings[s.key] || "";
      await supabase.from("site_settings").upsert({ key: s.key, value }, { onConflict: "key" });
    }
    toast({ title: "Settings saved" });
    setSaving(false);
  };

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
        </Button>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {SETTINGS_KEYS.filter((_, i) => i < 4).map((s) => (
              <div key={s.key} className="space-y-2">
                <Label>{s.label}</Label>
                {s.type === "textarea" ? (
                  <Textarea value={settings[s.key] || ""} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} />
                ) : (
                  <Input value={settings[s.key] || ""} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {SETTINGS_KEYS.filter((_, i) => i >= 4 && i < 7).map((s) => (
              <div key={s.key} className="space-y-2">
                <Label>{s.label}</Label>
                <Input value={settings[s.key] || ""} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">SEO & Analytics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {SETTINGS_KEYS.filter((_, i) => i >= 7).map((s) => (
              <div key={s.key} className="space-y-2">
                <Label>{s.label}</Label>
                {s.type === "textarea" ? (
                  <Textarea value={settings[s.key] || ""} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} />
                ) : (
                  <Input value={settings[s.key] || ""} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteSettings;
