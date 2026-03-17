import { useRef, useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import MarkdownToolbar from "./MarkdownToolbar";
import BlockInserter from "./BlockInserter";
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

    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + before.length + insert.length;
      ta.setSelectionRange(
        selected ? cursorPos + after.length : start + before.length,
        selected ? cursorPos + after.length : start + before.length + insert.length
      );
    });
  }, [value, onChange]);

  const handleBlockInsert = useCallback((snippet: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      onChange(value + snippet);
      return;
    }
    const pos = ta.selectionStart;
    const newValue = value.slice(0, pos) + snippet + value.slice(pos);
    onChange(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = pos + snippet.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  }, [value, onChange]);

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex items-center gap-1 bg-muted/50 border-b border-border p-1.5">
        <MarkdownToolbar
          textareaRef={textareaRef}
          onInsert={handleInsert}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
        />
        <BlockInserter onInsert={handleBlockInsert} />
      </div>
      {previewMode ? (
        <div className="p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto" style={{ minHeight }}>
          {value ? <MarkdownRenderer content={value} /> : <p className="text-muted-foreground italic">Nothing to preview</p>}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Type / to search blocks, or start writing..."}
          className="border-0 rounded-none focus-visible:ring-0 font-mono text-sm resize-y"
          style={{ minHeight }}
        />
      )}
    </div>
  );
};

export default MarkdownEditor;

