import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, Bot, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CodeRow {
  id: string;
  code: string;
  reward: string;
  region: string;
  category: string;
  status: string;
  source: string;
  expires_at: string | null;
  synced_at: string;
}

const REGIONS = ["GLOBAL", "INDIA", "BRAZIL", "INDONESIA", "EUROPE"];

const CodesList = () => {
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCodes = async () => {
    setLoading(true);
    let query = supabase
      .from("synced_codes")
      .select("id, code, reward, region, category, status, source, expires_at, synced_at")
      .eq("source", "manual")
      .order("synced_at", { ascending: false })
      .limit(200);
    if (regionFilter !== "ALL") query = query.eq("region", regionFilter);
    const { data, error } = await query;
    if (!error) setCodes((data as CodeRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadCodes(); }, [regionFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this code?")) return;
    const { error } = await supabase.from("synced_codes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Code deleted" });
      loadCodes();
    }
  };

  const markExpired = async (id: string) => {
    const { error } = await supabase.from("synced_codes").update({ status: "Expired" }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Marked as expired" });
      loadCodes();
    }
  };

  const statusColor = (s: string) => {
    if (s === "Working") return "default";
    if (s === "Limited") return "secondary";
    return "outline";
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">Codes</h1>
        <Button onClick={() => navigate("/admin/codes/new")} size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Code
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Codes you add here show up immediately and stay live until they expire or you mark them expired —
        unlike AI-discovered codes, they aren't tied to the hourly sync cycle.
      </p>

      <div className="flex gap-2 mb-4">
        <Button variant={regionFilter === "ALL" ? "default" : "outline"} size="sm" onClick={() => setRegionFilter("ALL")}>All</Button>
        {REGIONS.map((r) => (
          <Button key={r} variant={regionFilter === r ? "default" : "outline"} size="sm" onClick={() => setRegionFilter(r)}>{r}</Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : codes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No manually-added codes yet.</p>
          <Button onClick={() => navigate("/admin/codes/new")} variant="outline" className="mt-4">Add your first code</Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono font-medium">{c.code}</TableCell>
                <TableCell className="max-w-[220px] truncate">{c.reward}</TableCell>
                <TableCell>{c.region}</TableCell>
                <TableCell><Badge variant={statusColor(c.status)}>{c.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.expires_at ? new Date(c.expires_at).toLocaleString() : "No expiry set"}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  {c.status === "Working" && (
                    <Button variant="ghost" size="sm" onClick={() => markExpired(c.id)}>Mark Expired</Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/codes/${c.id}`)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-10 pt-6 border-t border-border text-sm text-muted-foreground flex items-start gap-2">
        <Bot className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          AI-discovered codes (found automatically from web search) aren't shown here — they cycle hourly and
          only publish when a real source backs them up. This page is for codes <UserCheck className="w-3.5 h-3.5 inline -mt-0.5" /> you've verified yourself.
        </p>
      </div>
    </div>
  );
};

export default CodesList;
