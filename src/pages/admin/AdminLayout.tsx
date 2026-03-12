import { Outlet, Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, LayoutDashboard, FileText, File, Image, Menu, Settings, ArrowLeftRight, LogOut, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/pages", label: "Pages", icon: File },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/menus", label: "Menus", icon: Menu },
  { to: "/admin/redirects", label: "Redirects", icon: ArrowLeftRight },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { user, roles, loading, signOut } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn("bg-card border-r border-border flex flex-col transition-all duration-200", collapsed ? "w-16" : "w-60")}>
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Zap className="w-6 h-6 text-accent flex-shrink-0" />
          {!collapsed && <span className="font-bold text-foreground text-sm truncate">FF Admin</span>}
          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border">
          {!collapsed && (
            <div className="px-3 py-2 text-xs text-muted-foreground truncate mb-1">
              {user.email} · <span className="capitalize">{roles[0]}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-destructive hover:text-destructive" onClick={signOut}>
            <LogOut className="w-4 h-4" />
            {!collapsed && "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
