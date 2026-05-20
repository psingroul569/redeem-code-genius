import { useEffect } from "react";
import { DEFAULT_URL } from "@/constants";

interface SEOOptions {
  title: string;
  description: string;
  path: string; // e.g. "/blogs" or "/code/abc"
  image?: string;
}

/**
 * Sets per-route title, meta description, canonical, and OG/Twitter tags.
 * Restores none on unmount (next route overrides).
 */
export function useSEO({ title, description, path, image }: SEOOptions) {
  useEffect(() => {
    document.title = title;

    const ensureMeta = (selector: string, attr: string, attrValue: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    ensureMeta('meta[name="description"]', "name", "description", description);
    ensureMeta('meta[property="og:title"]', "property", "og:title", title);
    ensureMeta('meta[property="og:description"]', "property", "og:description", description);
    ensureMeta('meta[property="og:url"]', "property", "og:url", `${DEFAULT_URL}${path}`);
    ensureMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    ensureMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    if (image) {
      ensureMeta('meta[property="og:image"]', "property", "og:image", image);
      ensureMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${DEFAULT_URL}${path}`);
  }, [title, description, path, image]);
}
