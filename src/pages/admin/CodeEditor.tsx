import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const REGIONS = ["GLOBAL", "INDIA", "BRAZIL", "INDONESIA", "EUROPE"];
const CATEGORIES = ["Diamond", "Skin", "Bundle", "Voucher", "Pet"];

interface CodeData {
  code: string;
  reward: string;
  description: string;
  region: string;
  category: string;
  status: string;
  expires_at: string; // datetime-local input value
  source_url: string;
}

const slugify = (region: string, code: string) =>
  `${region.toLowerCase()}-manual-${code.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

const CodeEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<CodeData>({
    code: "",
    reward: "",
    description: "",
    region: "GLOBAL",
    category: "Diamond",
    status: "Working",
    expires_at: "",
    source_url: "",
  });

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("synced_codes")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data: row, error }) => {
        if (error || !row) {
          navigate("/admin/codes");
          return;
        }
        const citations = Array.isArray(row.citations) ? (row.citations as any[]) : [];
        setData({
          code: row.code,
          reward: row.reward,
          description: "",
          region: row.region,
          category: row.category,
          status: row.status,
          expires_at: row.expires_at ? new Date(row.expires_at).toISOString().slice(0, 16) : "",
          source_url: citations[0]?.uri || "",
        });
        setLoading(false);
      });
  }, [id, isNew, navigate]);

  const updateField = (key: keyof CodeData, value: string) => setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!data.code.trim()) { toast({ title: "Code is required", variant: "destructive" }); return; }
    if (!data.reward.trim()) { toast({ title: "Reward is required", variant: "destructive" }); return; }
    setSaving(true);

    const now = new Date();
    const hourKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-${now.getUTCHours()}`;

    const payload = {
      code: data.code.trim(),
      reward: data.reward.trim(),
      region: data.region,
      category: data.category,
      status: data.status,
      source: "manual",
      hour_key: hourKey,
      slug: slugify(data.region, data.code.trim()),
      expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null,
      citations: data.source_url.trim() ? [{ uri: data.source_url.trim(), title: "Source" }] : [],
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("synced_codes").insert(payload));
    } else {
      ({ error } = await supabase.from("synced_codes").update(payload).eq("id", id));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Code added" : "Code updated", description: "It's live on the site now." });
      navigate("/admin/codes");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/codes")} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Codes
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isNew ? "Publish Code" : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>{isNew ? "Add a Verified Code" : "Edit Code"}</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="code">Redeem Code *</Label>
            <Input id="code" value={data.code} onChange={(e) => updateField("code", e.target.value.toUpperCase())} placeholder="FF12-ABCD-5678" className="font-mono" />
          </div>
          <div>
            <Label htmlFor="reward">Reward *</Label>
            <Input id="reward" value={data.reward} onChange={(e) => updateField("reward", e.target.value)} placeholder="500 Diamonds + Weapon Royale Voucher" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Region</Label>
              <Select value={data.region} onValueChange={(v) => updateField("region", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={data.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={data.status} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Working">Working</SelectItem>
                  <SelectItem value="Limited">Limited (near cap)</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expires">Expires At (optional)</Label>
              <Input id="expires" type="datetime-local" value={data.expires_at} onChange={(e) => updateField("expires_at", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="source">Source URL (optional but recommended)</Label>
            <Input id="source" value={data.source_url} onChange={(e) => updateField("source_url", e.target.value)} placeholder="https://x.com/FreeFire/status/..." />
            <p className="text-xs text-muted-foreground mt-1">Where you saw this code — shown as a citation on the code card.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditor;
