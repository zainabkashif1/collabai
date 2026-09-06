import { useRef, useState } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfilePicturePicker({
  name,
  value,
  onChange,
}: {
  name: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError(null);
      onChange(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => setError("Couldn't read that image.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-signal/10 grid place-items-center text-lg font-semibold text-signal">
        {value ? <img src={value} alt={`${name}'s profile`} className="h-full w-full object-cover" /> : initials(name)}
      </div>
      <div className="flex flex-col items-start gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-signal hover:underline"
        >
          {value ? "Change picture" : "Add profile picture"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-ink/50 hover:text-ink">
            Remove picture
          </button>
        )}
        <p className="text-xs text-ink/45">JPG, PNG, or GIF up to 2 MB</p>
        {error && <p className="text-xs text-ember">{error}</p>}
      </div>
    </div>
  );
}