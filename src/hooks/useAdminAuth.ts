import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AdminRole = "admin" | "editor" | "author" | "moderator";

interface AdminAuth {
  user: User | null;
  roles: AdminRole[];
  loading: boolean;
  hasRole: (role: AdminRole) => boolean;
  signOut: () => Promise<void>;
}

export const useAdminAuth = (): AdminAuth => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setRoles([]);
        setLoading(false);
        navigate("/admin/login");
        return;
      }
      setUser(session.user);
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const userRoles = (data || []).map((r) => r.role as AdminRole);
      if (userRoles.length === 0) {
        await supabase.auth.signOut();
        navigate("/admin/login");
      }
      setRoles(userRoles);
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        setLoading(false);
        navigate("/admin/login");
        return;
      }
      setUser(session.user);
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const userRoles = (data || []).map((r) => r.role as AdminRole);
      if (userRoles.length === 0) {
        await supabase.auth.signOut();
        navigate("/admin/login");
      }
      setRoles(userRoles);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return {
    user,
    roles,
    loading,
    hasRole: (role) => roles.includes(role),
    signOut: async () => {
      await supabase.auth.signOut();
      navigate("/admin/login");
    },
  };
};
