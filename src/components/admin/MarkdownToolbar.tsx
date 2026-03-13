import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Link, Image, Code, Quote, Minus, Eye, Edit
} from "lucide-react";

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInsert: (before: string, after?: string, defaultText?: string) => void;
  previewMode: boolean;
  onTogglePreview: () => void;
}

const MarkdownToolbar = ({ textareaRef, onInsert, previewMode, onTogglePreview }: MarkdownToolbarProps) => {
  const tools = [
    { icon: Bold, label: "Bold", action: () => onInsert("**", "**", "bold text") },
    { icon: Italic, label: "Italic", action: () => onInsert("*", "*", "italic text") },
    { icon: Heading1, label: "H1", action: () => onInsert("\n# ", "", "Heading 1") },
    { icon: Heading2, label: "H2", action: () => onInsert("\n## ", "", "Heading 2") },
    { icon: Heading3, label: "H3", action: () => onInsert("\n### ", "", "Heading 3") },
    null, // separator
    { icon: List, label: "Bullet List", action: () => onInsert("\n- ", "", "List item") },
    { icon: ListOrdered, label: "Numbered List", action: () => onInsert("\n1. ", "", "List item") },
    { icon: Quote, label: "Blockquote", action: () => onInsert("\n> ", "", "Quote") },
    { icon: Minus, label: "Divider", action: () => onInsert("\n---\n") },
    null, // separator
    { icon: Link, label: "Link", action: () => onInsert("[", "](https://)", "link text") },
    { icon: Image, label: "Image", action: () => onInsert("![", "](https://image-url)", "alt text") },
    { icon: Code, label: "Code Block", action: () => onInsert("\n```\n", "\n```\n", "code here") },
  ];

  return (
    <div className="flex items-center gap-0.5 flex-wrap bg-muted/50 border border-border rounded-t-md p-1.5">
      {tools.map((tool, i) =>
        tool === null ? (
          <div key={`sep-${i}`} className="w-px h-6 bg-border mx-1" />
        ) : (
          <Button
            key={tool.label}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={tool.label}
            onClick={tool.action}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        )
      )}
      <div className="flex-1" />
      <Button
        type="button"
        variant={previewMode ? "default" : "ghost"}
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={onTogglePreview}
      >
        {previewMode ? <Edit className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        {previewMode ? "Edit" : "Preview"}
      </Button>
    </div>
  );
};

export default MarkdownToolbar;
