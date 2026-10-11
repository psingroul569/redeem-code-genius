import { useCallback, useEffect, useState } from "react";
import { RedeemCode } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getVisitorId, getDisplayName, setDisplayName } from "@/lib/visitor";
import { formatRelativeTime as formatTimeAgo } from "@/lib/time";

export interface RealComment {
  id: string;
  displayName: string;
  text: string;
  likes: number;
  createdAt: string;
  isOwn: boolean;
}

export function useComments(code: RedeemCode) {
  const [comments, setComments] = useState<RealComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const visitorId = getVisitorId();

  const load = useCallback(async () => {
    if (!code.id) {
      setComments([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("code_comments" as never, undefined as never)
      .select("id, display_name, text, likes, created_at, visitor_id")
      .eq("code_id", code.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const rows = (data as unknown as Array<{
      id: string; display_name: string; text: string; likes: number; created_at: string; visitor_id: string;
    }>) || [];

    setComments(
      rows.map((r) => ({
        id: r.id,
        displayName: r.display_name,
        text: r.text,
        likes: r.likes,
        createdAt: r.created_at,
        isOwn: r.visitor_id === visitorId,
      })),
    );
    setLoading(false);
  }, [code.id, visitorId]);

  useEffect(() => {
    load();
  }, [load]);

  const addComment = useCallback(
    async (text: string, name?: string) => {
      if (!code.id || !text.trim()) return;
      const displayName = (name?.trim() || getDisplayName() || "Player").slice(0, 40);
      if (name?.trim()) setDisplayName(name.trim());

      const { error } = await supabase.from("code_comments" as never, undefined as never).insert({
        code_id: code.id,
        visitor_id: visitorId,
        display_name: displayName,
        text: text.trim().slice(0, 500),
      } as never);

      if (!error) await load();
      return !error;
    },
    [code.id, visitorId, load],
  );

  const toggleLike = useCallback(
    async (commentId: string) => {
      const wasLiked = likedIds.has(commentId);
      setLikedIds((prev) => {
        const next = new Set(prev);
        wasLiked ? next.delete(commentId) : next.add(commentId);
        return next;
      });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, likes: Math.max(0, c.likes + (wasLiked ? -1 : 1)) } : c)),
      );

      const { data, error } = await supabase.rpc("toggle_comment_like" as never, {
        p_comment_id: commentId,
        p_visitor_id: visitorId,
      } as never);

      if (error) {
        // Roll back on failure (e.g. RPC not deployed yet)
        setLikedIds((prev) => {
          const next = new Set(prev);
          wasLiked ? next.add(commentId) : next.delete(commentId);
          return next;
        });
        await load();
        return;
      }
      if (typeof data === "number") {
        setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, likes: data } : c)));
      }
    },
    [likedIds, visitorId, load],
  );

  return { comments, loading, addComment, toggleLike, likedIds, formatTimeAgo };
}
