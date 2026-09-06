import { CategoryPicker } from "../profile/CategoryPicker";
import type { Difficulty } from "../../data/mockProjects";

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  categories: string[];
  onCategoriesChange: (v: string[]) => void;
  difficulty: Difficulty | null;
  onDifficultyChange: (v: Difficulty | null) => void;
  remoteOnly: boolean;
  onRemoteOnlyChange: (v: boolean) => void;
  resultCount: number;
  onClear: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  categories,
  onCategoriesChange,
  difficulty,
  onDifficultyChange,
  remoteOnly,
  onRemoteOnlyChange,
  resultCount,
  onClear,
}: FilterBarProps) {
  const hasFilters = search.length > 0 || categories.length > 0 || difficulty !== null || remoteOnly;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search projects by title…"
        className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-signal"
      />

      <CategoryPicker value={categories} onChange={onCategoriesChange} />

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onDifficultyChange(difficulty === level ? null : level)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                difficulty === level
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink/60 border-line hover:border-ink/30"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 text-sm text-ink/60 ml-auto">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => onRemoteOnlyChange(e.target.checked)}
            className="accent-signal"
          />
          Remote only
        </label>

        <div className="w-full flex items-center justify-between border-t border-line pt-3 text-xs text-ink/50">
          <span>{resultCount} project{resultCount === 1 ? "" : "s"} found</span>
          {hasFilters && (
            <button type="button" onClick={onClear} className="font-medium text-signal hover:text-signal/70 transition-colors">
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
