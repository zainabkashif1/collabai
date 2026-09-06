import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { FilterBar } from "../components/discovery/FilterBar";
import { ProjectCard } from "../components/discovery/ProjectCard";
import { Button } from "../components/ui/Button";
import { useProjects } from "../context/ProjectsContext";
import type { Difficulty } from "../data/mockProjects";

export default function Discover() {
  const { projects } = useProjects();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => categories.length === 0 || categories.includes(p.category))
      .filter((p) => !difficulty || p.difficulty === difficulty)
      .filter((p) => !remoteOnly || p.remote)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [projects, search, categories, difficulty, remoteOnly]);

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Discover Projects</h1>
            <p className="text-ink/50 text-sm mt-1">
              Sorted by match — see how match scores are calculated once the AI matching engine is built.
            </p>
          </div>
          <Link to="/projects/new">
            <Button variant="primary">+ New Project</Button>
          </Link>
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          onCategoriesChange={setCategories}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          remoteOnly={remoteOnly}
          onRemoteOnlyChange={setRemoteOnly}
          resultCount={filteredProjects.length}
          onClear={() => {
            setSearch("");
            setCategories([]);
            setDifficulty(null);
            setRemoteOnly(false);
          }}
        />

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-ink/60">
            <p>No projects match those filters.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
