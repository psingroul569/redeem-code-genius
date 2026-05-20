import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import { ArrowLeft, Clock, Calendar, Loader2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  reading_time: number;
  published_at: string | null;
}

const Blogs = () => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, featured_image, reading_time, published_at")
      .eq("status", "published")
      .eq("visibility", "public")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-8">Blogs</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground leading-relaxed">No blog posts yet. Stay tuned for the latest Free Fire news, tips, and updates.</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blogs/${post.slug}`} className="group block">
                <article className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors">
                  {post.featured_image && (
                    <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-display uppercase tracking-tight text-foreground group-hover:text-accent transition-colors mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="text-muted-foreground text-sm leading-relaxed mb-3">{post.excerpt}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.published_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                      {post.reading_time > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.reading_time} min
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;
