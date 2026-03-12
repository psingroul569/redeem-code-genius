import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, File, Image, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ posts: 0, pages: 0, media: 0, published: 0 });

  useEffect(() => {
    const load = async () => {
      const [postsRes, pagesRes, mediaRes, pubRes] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("pages").select("id", { count: "exact", head: true }),
        supabase.from("media").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
      ]);
      setStats({
        posts: postsRes.count || 0,
        pages: pagesRes.count || 0,
        media: mediaRes.count || 0,
        published: pubRes.count || 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Total Posts", value: stats.posts, icon: FileText, to: "/admin/posts", color: "text-blue-500" },
    { label: "Published", value: stats.published, icon: Eye, to: "/admin/posts", color: "text-accent" },
    { label: "Pages", value: stats.pages, icon: File, to: "/admin/pages", color: "text-orange-500" },
    { label: "Media Files", value: stats.media, icon: Image, to: "/admin/media", color: "text-purple-500" },
  ];

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link to={c.to} key={c.label}>
            <Card className="hover:border-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{c.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
