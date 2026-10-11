import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight } from "lucide-react";

interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
}

// Surfaces the newest posts on the homepage — which Google already recrawls
// often (hourly priority in the sitemap, thanks to the live code data) — so a
// brand-new article gets a real, crawlable link from a high-frequency page
// instead of waiting for Google to stumble onto it via the sitemap alone.
export const LatestBlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, featured_image, published_at")
      .eq("status", "published")
      .eq("visibility", "public")
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setPosts(data || []));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14" aria-label="Latest from the blog">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight">
          Latest From the <span className="text-success">Blog</span>
        </h2>
        <Link to="/blogs" className="text-sm text-success font-bold underline hover:no-underline whitespace-nowrap">
          View all articles
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/blogs/${post.slug}`} className="group block">
            <article className="bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col hover:border-success/30 transition-colors">
              {post.featured_image && (
                <img src={post.featured_image} alt={post.title} className="w-full h-40 object-cover" loading="lazy" />
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display uppercase tracking-tight text-foreground text-base mb-2 group-hover:text-success transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-t-body leading-relaxed line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-2">
                  {post.published_at && (
                    <span className="flex items-center gap-1.5 text-[10px] text-t-muted font-tech uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-t-muted group-hover:text-success group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestBlogPosts;
