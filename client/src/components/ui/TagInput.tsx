import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/**
 * Deliberately uncontrolled-feeling but controlled underneath: the text
 * being typed lives in local state (`draft`), while the committed list
 * of tags lives in the parent via `value`/`onChange`. This split is a
 * common pattern for "type to add" inputs — the draft isn't a tag yet
 * until Enter commits it.
 */
export function TagInput({ label, value, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // stop it from submitting the surrounding form
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      // Backspace on an empty input removes the last tag — matches the
      // behavior people expect from Gmail's "To" field and similar.
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink/80">{label}</label>
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-line bg-white px-2.5 py-2 focus-within:border-signal">
        <AnimatePresence initial={false}>
          {value.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 rounded-full bg-signal-soft px-2.5 py-1 text-xs font-medium text-signal"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="hover:opacity-60"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] outline-none text-sm py-1 placeholder:text-ink/30"
        />
      </div>
    </div>
  );
}
