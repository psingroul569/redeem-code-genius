import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => (
  <div className={className}>
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw]}
    components={{
      h1: ({ children }) => <h1 className="text-3xl font-bold text-foreground mt-8 mb-4">{children}</h1>,
      h2: ({ children }) => <h2 className="text-2xl font-bold text-foreground mt-8 mb-3">{children}</h2>,
      h3: ({ children }) => <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">{children}</h3>,
      h4: ({ children }) => <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h4>,
      p: ({ children }) => <p className="text-foreground/85 leading-relaxed mb-4">{children}</p>,
      a: ({ href, children }) => (
        <a href={href} className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-foreground/85">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-foreground/85">{children}</ol>,
      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 py-1 my-4 italic text-foreground/70">{children}</blockquote>
      ),
      code: ({ className, children, ...props }) => {
        const isInline = !className;
        return isInline ? (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>{children}</code>
        ) : (
          <code className={`${className} block bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto my-4`} {...props}>{children}</code>
        );
      },
      pre: ({ children }) => <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4 text-sm">{children}</pre>,
      img: ({ src, alt }) => (
        <img src={src} alt={alt || ""} className="rounded-lg max-w-full h-auto my-4" loading="lazy" />
      ),
      hr: () => <hr className="border-border my-8" />,
      table: ({ children }) => (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border border-border rounded-lg">{children}</table>
        </div>
      ),
      th: ({ children }) => <th className="bg-muted px-4 py-2 text-left font-semibold text-foreground border-b border-border">{children}</th>,
      td: ({ children }) => <td className="px-4 py-2 text-foreground/85 border-b border-border">{children}</td>,
    }}
  >
    {content}
  </ReactMarkdown>
  </div>
);

export default MarkdownRenderer;
