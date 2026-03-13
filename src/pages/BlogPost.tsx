import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ArrowLeft, Clock, Calendar, Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  reading_time: number;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  category_id: string | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
        if (data) {
          document.title = data.seo_title || data.title;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc && data.seo_description) metaDesc.setAttribute("content", data.seo_description);
        }
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground font-tech">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-display text-foreground mb-4">Post Not Found</h1>
          <Link to="/blogs" className="text-accent hover:underline">← Back to Blogs</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>

        {post.featured_image && (
          <img src={post.featured_image} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8" />
        )}

        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
          {post.reading_time > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.reading_time} min read
            </span>
          )}
        </div>

        <article className="max-w-none">
          <MarkdownRenderer content={post.content || ""} />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
