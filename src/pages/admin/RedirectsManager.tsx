import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RedirectsManager = () => {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("301");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
    setRedirects(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!from.trim() || !to.trim()) return;
    const { error } = await supabase.from("redirects").insert({ from_path: from, to_path: to, type: parseInt(type) });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setFrom(""); setTo(""); load(); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("redirects").delete().eq("id", id);
    load();
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Redirects</h1>
      <div className="flex gap-2 mb-6">
        <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="/old-path" className="flex-1" />
        <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="/new-path" className="flex-1" />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="301">301</SelectItem><SelectItem value="302">302</SelectItem></SelectContent>
        </Select>
        <Button onClick={handleAdd} size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Type</TableHead><TableHead></TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {redirects.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-sm">{r.from_path}</TableCell>
                <TableCell className="font-mono text-sm">{r.to_path}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RedirectsManager;
