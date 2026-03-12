import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2, GripVertical, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  sort_order: number;
}

interface MenuData {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
}

const MenusManager = () => {
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMenuName, setNewMenuName] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data: menuData } = await supabase.from("menus").select("*").order("name");
    const allMenus: MenuData[] = [];
    for (const m of menuData || []) {
      const { data: items } = await supabase.from("menu_items").select("*").eq("menu_id", m.id).order("sort_order");
      allMenus.push({ ...m, items: items || [] });
    }
    setMenus(allMenus);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addMenu = async () => {
    if (!newMenuName.trim()) return;
    const { error } = await supabase.from("menus").insert({ name: newMenuName, location: "primary" });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNewMenuName(""); load(); }
  };

  const addItem = async (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId);
    const nextOrder = (menu?.items.length || 0) + 1;
    await supabase.from("menu_items").insert({ menu_id: menuId, label: "New Link", url: "/", sort_order: nextOrder });
    load();
  };

  const updateItem = (menuId: string, itemId: string, field: string, value: string) => {
    setMenus((prev) =>
      prev.map((m) =>
        m.id === menuId ? { ...m, items: m.items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)) } : m
      )
    );
  };

  const saveItems = async (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId);
    if (!menu) return;
    for (const item of menu.items) {
      await supabase.from("menu_items").update({ label: item.label, url: item.url, sort_order: item.sort_order }).eq("id", item.id);
    }
    toast({ title: "Menu saved" });
  };

  const deleteItem = async (itemId: string) => {
    await supabase.from("menu_items").delete().eq("id", itemId);
    load();
  };

  const deleteMenu = async (menuId: string) => {
    if (!confirm("Delete this menu?")) return;
    await supabase.from("menus").delete().eq("id", menuId);
    load();
  };

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Menus</h1>
      <div className="flex gap-2 mb-6">
        <Input value={newMenuName} onChange={(e) => setNewMenuName(e.target.value)} placeholder="New menu name" className="max-w-xs" />
        <Button onClick={addMenu} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Menu</Button>
      </div>
      <div className="space-y-6">
        {menus.map((menu) => (
          <Card key={menu.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{menu.name} <span className="text-muted-foreground text-sm font-normal">({menu.location})</span></CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => saveItems(menu.id)}><Save className="w-3 h-3 mr-1" /> Save</Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMenu(menu.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {menu.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <Input value={item.label} onChange={(e) => updateItem(menu.id, item.id, "label", e.target.value)} className="flex-1" placeholder="Label" />
                  <Input value={item.url} onChange={(e) => updateItem(menu.id, item.id, "url", e.target.value)} className="flex-1" placeholder="/path" />
                  <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem(menu.id)} className="mt-2"><Plus className="w-3 h-3 mr-1" /> Add Item</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenusManager;
