import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ff/Header";
import { Footer } from "@/components/ff/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Loader2 } from "lucide-react";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
}

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
      .then(({ data, error }) => {
        if (data) {
          setPage(data);
          document.title = data.seo_title || data.title;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc && data.seo_description) metaDesc.setAttribute("content", data.seo_description);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen bg-background text-foreground font-tech">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-6">Page not found</p>
          <Link to="/" className="text-accent hover:underline">← Return to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-8">
          {page.title}
        </h1>
        <article className="max-w-none">
          <MarkdownRenderer content={page.content || ""} />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default DynamicPage;
