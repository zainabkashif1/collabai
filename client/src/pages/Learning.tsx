import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PageTransition } from "../components/PageTransition";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { PlayIcon, StarIcon } from "../components/ui/Icon";
import { learningResources, type LearningKind, type LearningResource } from "../data/learningResources";

type ViewFilter = "All" | LearningKind;

const accentClasses = {
  signal: "from-signal/15 via-signal-soft to-white text-signal",
  ember: "from-ember/15 via-ember-soft to-white text-ember",
  mint: "from-mint/15 via-mint-soft to-white text-mint",
};

function ResourceArtwork({ resource }: { resource: LearningResource }) {
  return (
    <div className={`group/art relative flex aspect-[16/8] items-end overflow-hidden bg-gradient-to-br p-5 ${accentClasses[resource.accent]}`}>
      {resource.videoId ? (
        <img
          src={`https://i.ytimg.com/vi/${resource.videoId}/hqdefault.jpg`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-multiply transition-transform duration-500 group-hover/art:scale-105"
        />
      ) : (
        <div className="absolute right-5 top-4 font-display text-6xl font-bold opacity-10">DOC</div>
      )}
      {resource.videoId && (
        <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-200 group-hover/art:opacity-100">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-lg">
            <PlayIcon className="h-4 w-4 translate-x-0.5" />
          </span>
        </div>
      )}
      <div className="relative flex w-full items-center justify-between text-white drop-shadow-md">
        <span className="rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide">
          {resource.kind}
        </span>
        <span className="rounded-full bg-ink/70 px-2.5 py-1 text-xs">{resource.duration}</span>
      </div>
    </div>
  );
}

function ResourceCard({ resource, isSaved, onSave, onWatch }: {
  resource: LearningResource;
  isSaved: boolean;
  onSave: () => void;
  onWatch: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/5"
    >
      <button type="button" onClick={onWatch} className="block w-full text-left">
        <ResourceArtwork resource={resource} />
      </button>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone={resource.kind === "Video" ? "signal" : "ember"}>{resource.language}</Badge>
          <span className="text-xs text-ink/45">{resource.topic}</span>
        </div>
        <h2 className="font-display text-lg font-semibold">{resource.title}</h2>
        <p className="mt-2 min-h-10 text-sm leading-5 text-ink/60">{resource.description}</p>
        <div className="mt-5 flex items-center gap-2">
          <Button type="button" onClick={onWatch} className="flex-1">
            {resource.kind === "Video" ? "Watch video" : "Find documentary"}
          </Button>
          <button
            type="button"
            onClick={onSave}
            aria-label={isSaved ? `Remove ${resource.title} from saved` : `Save ${resource.title}`}
            className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors ${
              isSaved ? "border-signal bg-signal-soft text-signal" : "border-line text-ink/45 hover:border-signal/40 hover:text-signal"
            }`}
          >
            <StarIcon className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function WatchDialog({ resource, onClose }: { resource: LearningResource; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={resource.title}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, y: 8, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-4xl overflow-hidden rounded-xl bg-ink shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 text-white">
          <div>
            <p className="font-display font-semibold">{resource.title}</p>
            <p className="text-xs text-white/55">Playing from YouTube</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close video" className="rounded-full px-3 py-1 text-xl text-white/70 hover:bg-white/10 hover:text-white">
            ×
          </button>
        </div>
        <div className="aspect-video bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${resource.videoId}?autoplay=1&rel=0`}
            title={resource.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Learning() {
  const [view, setView] = useState<ViewFilter>("All");
  const [language, setLanguage] = useState("All languages");
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("collabai:saved-learning") ?? "[]") as string[];
    } catch {
      return [];
    }
  });
  const [activeResource, setActiveResource] = useState<LearningResource | null>(null);

  useEffect(() => {
    localStorage.setItem("collabai:saved-learning", JSON.stringify(savedIds));
  }, [savedIds]);

  const languages = ["All languages", ...new Set(learningResources.map((resource) => resource.language))];
  const filteredResources = useMemo(() => learningResources.filter((resource) => {
    const matchesView = view === "All" || resource.kind === view;
    const matchesLanguage = language === "All languages" || resource.language === language;
    const matchesSaved = !savedOnly || savedIds.includes(resource.id);
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${resource.title} ${resource.description} ${resource.topic}`.toLowerCase().includes(query);
    return matchesView && matchesLanguage && matchesSaved && matchesSearch;
  }), [language, search, view, savedOnly, savedIds]);

  function toggleSaved(id: string) {
    setSavedIds((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]);
  }

  function openResource(resource: LearningResource) {
    if (resource.videoId) {
      setActiveResource(resource);
      return;
    }

    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(resource.searchQuery ?? resource.title)}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-2xl bg-ink px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[32px] border-signal/30" />
          <div className="absolute -right-6 bottom-[-4.5rem] h-40 w-40 rounded-full border-[20px] border-ember/25" />
          <div className="relative max-w-2xl">
            <Badge tone="signal">LEARNING HUB</Badge>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Learn something worth sharing.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
              Watch practical lessons and discover thoughtful documentaries in the language that helps you learn best.
            </p>
          </div>
        </section>

        <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1 rounded-lg bg-ink/5 p-1">
            {(["All", "Video", "Documentary"] as ViewFilter[]).map((option) => (
              <button key={option} type="button" onClick={() => setView(option)} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${view === option ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"}`}>
                {option === "All" ? "Everything" : `${option}s`}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSavedOnly((v) => !v)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${savedOnly ? "bg-white text-signal shadow-sm" : "text-ink/55 hover:text-ink"}`}
            >
              <StarIcon className="h-3.5 w-3.5" fill={savedOnly ? "currentColor" : "none"} />
              Saved{savedIds.length > 0 ? ` (${savedIds.length})` : ""}
            </button>
          </div>
          <label className="relative lg:w-72">
            <span className="sr-only">Search learning resources</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search resources..." className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-signal focus:ring-4 focus:ring-signal/10" />
          </label>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {languages.map((option) => (
            <button key={option} type="button" onClick={() => setLanguage(option)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${language === option ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/55 hover:border-ink/30"}`}>
              {option}
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <p className="text-sm text-ink/50">{filteredResources.length} resource{filteredResources.length === 1 ? "" : "s"} to explore</p>
          {savedIds.length > 0 && !savedOnly && <p className="text-xs font-medium text-signal">{savedIds.length} saved for later</p>}
        </div>

        <motion.div layout className="mt-3 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} isSaved={savedIds.includes(resource.id)} onSave={() => toggleSaved(resource.id)} onWatch={() => openResource(resource)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredResources.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-12 text-center text-sm text-ink/55">
            {savedOnly ? "You haven't saved anything yet — tap the star on a resource to save it." : "No resources match those filters. Try another language or search term."}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeResource && <WatchDialog resource={activeResource} onClose={() => setActiveResource(null)} />}
      </AnimatePresence>
    </PageTransition>
  );
}
