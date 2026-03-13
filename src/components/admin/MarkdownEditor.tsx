import { useRef, useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import MarkdownToolbar from "./MarkdownToolbar";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const MarkdownEditor = ({ value, onChange, placeholder, minHeight = "400px" }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInsert = useCallback((before: string, after = "", defaultText = "") => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const insert = selected || defaultText;
    const newValue = value.slice(0, start) + before + insert + after + value.slice(end);
    onChange(newValue);

    // Set cursor position after React re-render
    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + before.length + insert.length;
      ta.setSelectionRange(
        selected ? cursorPos + after.length : start + before.length,
        selected ? cursorPos + after.length : start + before.length + insert.length
      );
    });
  }, [value, onChange]);

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <MarkdownToolbar
        textareaRef={textareaRef}
        onInsert={handleInsert}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
      />
      {previewMode ? (
        <div className="p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto" style={{ minHeight }}>
          {value ? <MarkdownRenderer content={value} /> : <p className="text-muted-foreground italic">Nothing to preview</p>}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-0 rounded-none focus-visible:ring-0 font-mono text-sm resize-y"
          style={{ minHeight }}
        />
      )}
    </div>
  );
};

export default MarkdownEditor;
