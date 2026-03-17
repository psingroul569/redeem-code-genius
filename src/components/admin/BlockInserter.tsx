import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus, Type, Heading, List, Quote, Code, Table2, Image, Video,
  FileText, Music, Columns3, Minus, Space, Calendar, Search,
  Share2, Navigation, User, Globe, MessageSquare, HelpCircle,
  ListChecks, BookOpen, LayoutTemplate, FileCode, Square, Layers,
  Youtube, Twitter, Instagram, X
} from "lucide-react";

export interface BlockDefinition {
  id: string;
  label: string;
  icon: React.ElementType;
  category: string;
  snippet: string;
  description: string;
}

const BLOCKS: BlockDefinition[] = [
  // TEXT
  { id: "paragraph", label: "Paragraph", icon: Type, category: "Text", description: "Plain text block",
    snippet: "\nYour text here.\n" },
  { id: "heading2", label: "Heading", icon: Heading, category: "Text", description: "H2/H3/H4 heading",
    snippet: "\n## Your Heading\n" },
  { id: "list-ul", label: "Bullet List", icon: List, category: "Text", description: "Unordered list",
    snippet: "\n- Item one\n- Item two\n- Item three\n" },
  { id: "list-ol", label: "Numbered List", icon: ListChecks, category: "Text", description: "Ordered list",
    snippet: "\n1. First item\n2. Second item\n3. Third item\n" },
  { id: "quote", label: "Blockquote", icon: Quote, category: "Text", description: "Quoted text",
    snippet: "\n> Your quote here.\n" },
  { id: "code", label: "Code Block", icon: Code, category: "Text", description: "Preformatted code",
    snippet: "\n```\n// Your code here\n```\n" },
  { id: "details", label: "Details / Accordion", icon: Layers, category: "Text", description: "Collapsible content",
    snippet: '\n<details>\n<summary>Click to expand</summary>\n\nYour hidden content here.\n\n</details>\n' },
  { id: "pullquote", label: "Pullquote", icon: Quote, category: "Text", description: "Highlighted quote",
    snippet: '\n<blockquote style="border-left:4px solid #f59e0b;padding:16px 20px;margin:24px 0;font-size:1.25rem;font-style:italic;background:#fef3c7;border-radius:8px;color:#92400e;">\n"Your important quote here."\n</blockquote>\n' },

  // MEDIA
  { id: "image", label: "Image", icon: Image, category: "Media", description: "Single image",
    snippet: '\n![Alt text](https://your-image-url.jpg)\n' },
  { id: "cover", label: "Cover Image", icon: Image, category: "Media", description: "Full-width cover with overlay text",
    snippet: '\n<div style="position:relative;width:100%;min-height:300px;background:url(\'https://your-image-url.jpg\') center/cover;border-radius:12px;overflow:hidden;margin:24px 0;">\n  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">\n    <h2 style="color:#fff;font-size:2rem;font-weight:bold;text-align:center;padding:20px;">Your Cover Title</h2>\n  </div>\n</div>\n' },
  { id: "video", label: "Video", icon: Video, category: "Media", description: "HTML5 video player",
    snippet: '\n<video controls style="width:100%;border-radius:8px;margin:16px 0;" preload="metadata">\n  <source src="https://your-video-url.mp4" type="video/mp4" />\n  Your browser does not support video.\n</video>\n' },
  { id: "audio", label: "Audio", icon: Music, category: "Media", description: "Audio player",
    snippet: '\n<audio controls style="width:100%;margin:16px 0;">\n  <source src="https://your-audio-url.mp3" type="audio/mpeg" />\n  Your browser does not support audio.\n</audio>\n' },
  { id: "file", label: "File Download", icon: FileText, category: "Media", description: "Download link",
    snippet: '\n<a href="https://your-file-url.pdf" download style="display:inline-flex;align-items:center;gap:8px;padding:12px 20px;background:#1e293b;color:#fff;border-radius:8px;text-decoration:none;margin:16px 0;">📎 Download File</a>\n' },
  { id: "media-text", label: "Media & Text", icon: Columns3, category: "Media", description: "Image beside text",
    snippet: '\n<div style="display:flex;gap:24px;align-items:center;margin:24px 0;flex-wrap:wrap;">\n  <img src="https://your-image-url.jpg" alt="Alt text" style="width:300px;border-radius:8px;flex-shrink:0;" />\n  <div style="flex:1;min-width:200px;">\n    <h3>Title Here</h3>\n    <p>Your description text goes here beside the image.</p>\n  </div>\n</div>\n' },

  // LAYOUT
  { id: "columns-2", label: "2 Columns", icon: Columns3, category: "Layout", description: "Two column layout",
    snippet: '\n<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0;">\n  <div>\n\n**Column 1**\n\nContent here.\n\n  </div>\n  <div>\n\n**Column 2**\n\nContent here.\n\n  </div>\n</div>\n' },
  { id: "columns-3", label: "3 Columns", icon: Columns3, category: "Layout", description: "Three column layout",
    snippet: '\n<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin:24px 0;">\n  <div>\n\n**Column 1**\n\nContent here.\n\n  </div>\n  <div>\n\n**Column 2**\n\nContent here.\n\n  </div>\n  <div>\n\n**Column 3**\n\nContent here.\n\n  </div>\n</div>\n' },
  { id: "separator", label: "Separator", icon: Minus, category: "Layout", description: "Horizontal divider",
    snippet: "\n---\n" },
  { id: "spacer", label: "Spacer", icon: Space, category: "Layout", description: "Vertical spacing",
    snippet: '\n<div style="height:48px;"></div>\n' },
  { id: "box", label: "Info Box", icon: Square, category: "Layout", description: "Styled content box",
    snippet: '\n<div style="padding:20px;border:2px solid #3b82f6;border-radius:12px;background:#eff6ff;margin:24px 0;">\n\n**ℹ️ Info Box Title**\n\nYour content inside the styled box.\n\n</div>\n' },
  { id: "warning-box", label: "Warning Box", icon: Square, category: "Layout", description: "Warning callout",
    snippet: '\n<div style="padding:20px;border:2px solid #f59e0b;border-radius:12px;background:#fffbeb;margin:24px 0;">\n\n**⚠️ Warning**\n\nImportant information that needs attention.\n\n</div>\n' },
  { id: "button", label: "Button", icon: Square, category: "Layout", description: "CTA button",
    snippet: '\n<a href="https://reward.ff.garena.com/en" target="_blank" rel="noopener" style="display:inline-block;padding:12px 32px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">Redeem Now →</a>\n' },

  // TABLE
  { id: "table", label: "Table", icon: Table2, category: "Table", description: "Data table",
    snippet: "\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n| Data 4   | Data 5   | Data 6   |\n" },
  { id: "table-html", label: "Styled Table", icon: Table2, category: "Table", description: "HTML table with styling",
    snippet: '\n<table style="width:100%;border-collapse:collapse;margin:24px 0;border-radius:8px;overflow:hidden;">\n  <thead>\n    <tr style="background:#1e293b;color:#fff;">\n      <th style="padding:12px 16px;text-align:left;">Header 1</th>\n      <th style="padding:12px 16px;text-align:left;">Header 2</th>\n      <th style="padding:12px 16px;text-align:left;">Header 3</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr style="background:#f8fafc;">\n      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">Data 1</td>\n      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">Data 2</td>\n      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">Data 3</td>\n    </tr>\n  </tbody>\n</table>\n' },

  // EMBEDS
  { id: "youtube", label: "YouTube", icon: Youtube, category: "Embeds", description: "Embed YouTube video",
    snippet: '\n<iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:12px;margin:16px 0;"></iframe>\n' },
  { id: "twitter", label: "Twitter/X Post", icon: Twitter, category: "Embeds", description: "Embed a tweet",
    snippet: '\n<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/TWEET_ID">Tweet</a></blockquote>\n<script async src="https://platform.twitter.com/widgets.js"></script>\n' },
  { id: "instagram", label: "Instagram Post", icon: Instagram, category: "Embeds", description: "Embed IG post",
    snippet: '\n<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/POST_ID/" style="max-width:540px;margin:16px auto;"></blockquote>\n<script async src="https://www.instagram.com/embed.js"></script>\n' },
  { id: "iframe", label: "Custom iFrame", icon: Globe, category: "Embeds", description: "Any embedded page",
    snippet: '\n<iframe src="https://example.com" width="100%" height="400" frameborder="0" style="border-radius:8px;margin:16px 0;" loading="lazy"></iframe>\n' },
  { id: "custom-html", label: "Custom HTML", icon: FileCode, category: "Embeds", description: "Raw HTML block",
    snippet: '\n<div>\n  <!-- Your custom HTML here -->\n  \n</div>\n' },

  // TEMPLATES
  { id: "faq-template", label: "FAQ Section", icon: HelpCircle, category: "Templates", description: "FAQ with schema markup",
    snippet: `
<div itemscope itemtype="https://schema.org/FAQPage">

## Frequently Asked Questions

<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">

<h3 itemprop="name">What are Free Fire redeem codes?</h3>

<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<div itemprop="text">

Free Fire redeem codes are 12-16 character alphanumeric codes released by Garena that give players free in-game rewards like diamonds, skins, bundles, and more.

</div>
</div>
</div>

<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">

<h3 itemprop="name">Your question here?</h3>

<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<div itemprop="text">

Your answer here.

</div>
</div>
</div>

</div>
` },
  { id: "howto-template", label: "How-To Guide", icon: BookOpen, category: "Templates", description: "Step-by-step with schema",
    snippet: `
<div itemscope itemtype="https://schema.org/HowTo">

<h2 itemprop="name">How to Redeem Free Fire Codes</h2>

<meta itemprop="totalTime" content="PT3M" />

<div itemscope itemprop="step" itemtype="https://schema.org/HowToStep">

**Step 1:** <span itemprop="text">Go to the official rewards site at reward.ff.garena.com</span>

</div>

<div itemscope itemprop="step" itemtype="https://schema.org/HowToStep">

**Step 2:** <span itemprop="text">Log in with your Free Fire account (Facebook, Google, VK, etc.)</span>

</div>

<div itemscope itemprop="step" itemtype="https://schema.org/HowToStep">

**Step 3:** <span itemprop="text">Enter the 12-character redeem code and click Confirm</span>

</div>

<div itemscope itemprop="step" itemtype="https://schema.org/HowToStep">

**Step 4:** <span itemprop="text">Open Free Fire and check your in-game mail for the rewards</span>

</div>

</div>
` },
  { id: "toc-template", label: "Table of Contents", icon: ListChecks, category: "Templates", description: "Jump-link TOC",
    snippet: `
<div style="padding:20px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;margin:24px 0;">

**📋 Table of Contents**

1. [Section One](#section-one)
2. [Section Two](#section-two)
3. [Section Three](#section-three)
4. [Conclusion](#conclusion)

</div>
` },

  // WIDGETS
  { id: "calendar", label: "Date Display", icon: Calendar, category: "Widgets", description: "Current date info",
    snippet: '\n<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#f1f5f9;border-radius:8px;font-size:0.875rem;margin:8px 0;">📅 Updated: March 2026</div>\n' },
  { id: "search-box", label: "Search Placeholder", icon: Search, category: "Widgets", description: "Visual search block",
    snippet: '\n<div style="padding:24px;background:#f8fafc;border-radius:12px;text-align:center;margin:24px 0;">\n  <p style="font-size:1.125rem;font-weight:600;margin-bottom:12px;">🔍 Search Redeem Codes</p>\n  <p style="color:#64748b;">Use Ctrl+F to search this page for specific codes or rewards.</p>\n</div>\n' },
  { id: "social-icons", label: "Social Icons", icon: Share2, category: "Widgets", description: "Social media links",
    snippet: '\n<div style="display:flex;gap:12px;justify-content:center;margin:24px 0;flex-wrap:wrap;">\n  <a href="https://youtube.com/" target="_blank" rel="noopener" style="padding:10px 20px;background:#ff0000;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">▶ YouTube</a>\n  <a href="https://instagram.com/" target="_blank" rel="noopener" style="padding:10px 20px;background:#e4405f;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">📷 Instagram</a>\n  <a href="https://twitter.com/" target="_blank" rel="noopener" style="padding:10px 20px;background:#1da1f2;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">🐦 Twitter</a>\n</div>\n' },
  { id: "author", label: "Author Bio", icon: User, category: "Widgets", description: "Author info block",
    snippet: '\n<div style="display:flex;gap:16px;align-items:center;padding:20px;border:1px solid #e2e8f0;border-radius:12px;margin:24px 0;">\n  <img src="https://ui-avatars.com/api/?name=Jaxon+Lee&background=1e293b&color=fff&size=64" alt="Author" style="width:64px;height:64px;border-radius:50%;" />\n  <div>\n    <p style="font-weight:700;margin:0 0 4px;">Jaxon Lee</p>\n    <p style="color:#64748b;font-size:0.875rem;margin:0;">Gaming content writer specializing in Free Fire. Verified codes daily since 2022.</p>\n  </div>\n</div>\n' },
  { id: "navigation", label: "Navigation Links", icon: Navigation, category: "Widgets", description: "Internal nav links",
    snippet: '\n<nav style="display:flex;gap:12px;flex-wrap:wrap;padding:16px;background:#f1f5f9;border-radius:12px;margin:24px 0;">\n  <a href="/" style="padding:8px 16px;background:#1e293b;color:#fff;border-radius:6px;text-decoration:none;font-size:0.875rem;">🏠 Home</a>\n  <a href="/blogs" style="padding:8px 16px;background:#1e293b;color:#fff;border-radius:6px;text-decoration:none;font-size:0.875rem;">📝 Blogs</a>\n  <a href="/guides" style="padding:8px 16px;background:#1e293b;color:#fff;border-radius:6px;text-decoration:none;font-size:0.875rem;">📖 Guides</a>\n  <a href="/faq" style="padding:8px 16px;background:#1e293b;color:#fff;border-radius:6px;text-decoration:none;font-size:0.875rem;">❓ FAQ</a>\n</nav>\n' },
  { id: "site-info", label: "Site Title & Tagline", icon: LayoutTemplate, category: "Widgets", description: "Branded header block",
    snippet: '\n<div style="text-align:center;padding:32px 20px;margin:24px 0;">\n  <h1 style="font-size:2rem;font-weight:800;margin:0 0 8px;">Free Fire Redeem Code Today</h1>\n  <p style="color:#64748b;font-size:1.125rem;margin:0;">Get the latest working codes — updated hourly</p>\n</div>\n' },
];

const CATEGORIES = ["Text", "Media", "Layout", "Table", "Embeds", "Templates", "Widgets"];

interface BlockInserterProps {
  onInsert: (snippet: string) => void;
}

const BlockInserter = ({ onInsert }: BlockInserterProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return BLOCKS;
    const q = search.toLowerCase();
    return BLOCKS.filter(
      (b) => b.label.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<string, BlockDefinition[]>();
    for (const cat of CATEGORIES) {
      const items = filtered.filter((b) => b.category === cat);
      if (items.length) map.set(cat, items);
    }
    return map;
  }, [filtered]);

  const handleInsert = (snippet: string) => {
    onInsert(snippet);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          Add Block
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="bottom">
        <div className="p-3 border-b border-border">
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
        </div>
        <ScrollArea className="h-[380px]">
          <div className="p-2">
            {Array.from(grouped.entries()).map(([category, items]) => (
              <div key={category} className="mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">{category}</p>
                <div className="grid grid-cols-3 gap-1">
                  {items.map((block) => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => handleInsert(block.snippet)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-lg hover:bg-muted transition-colors text-center"
                      title={block.description}
                    >
                      <block.icon className="w-5 h-5 text-foreground/70" />
                      <span className="text-[10px] leading-tight text-foreground/80 line-clamp-2">{block.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {grouped.size === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No blocks found</p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default BlockInserter;
