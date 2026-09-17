import { useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/** Simple comma/enter-delimited tag editor used for bullet point tags. */
export function TagInput({ tags, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    if (tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
      setDraft("");
    } else if (e.key === "Backspace" && draft.length === 0 && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-primary/70 hover:text-primary"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            addTag(draft);
            setDraft("");
          }}
          placeholder={tags.length === 0 ? placeholder ?? "Add a tag and press Enter" : ""}
          className="flex-1 min-w-[8ch] border-none bg-transparent py-0.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />
      </div>
      {tags.length === 0 && (
        <p className="mt-1 text-xs text-warning">Untagged - this bullet will be harder to match to a job later.</p>
      )}
    </div>
  );
}
