import { PROJECT_CATEGORIES } from "../../data/mockProfile";

interface CategoryPickerProps {
  value: string[];
  onChange: (categories: string[]) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  function toggle(category: string) {
    if (value.includes(category)) {
      onChange(value.filter((c) => c !== category));
    } else {
      onChange([...value, category]);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink/80">Preferred project categories</label>
      <div className="flex flex-wrap gap-2">
        {PROJECT_CATEGORIES.map((category) => {
          const active = value.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggle(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                active
                  ? "bg-signal text-white border-signal"
                  : "bg-white text-ink/60 border-line hover:border-signal/40"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
