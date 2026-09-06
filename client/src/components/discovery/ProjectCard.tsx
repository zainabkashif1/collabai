import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Badge } from "../ui/Badge";
import { MatchRing } from "./MatchRing";
import type { Project, Difficulty } from "../../data/mockProjects";

const difficultyTone: Record<Difficulty, "mint" | "signal" | "ember"> = {
  Beginner: "mint",
  Intermediate: "signal",
  Advanced: "ember",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/projects/${project.id}`}
        className="block rounded-xl border border-line bg-white p-5 hover:border-signal/40 hover:shadow-sm transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge tone="signal">{project.category}</Badge>
              <Badge tone={difficultyTone[project.difficulty]}>{project.difficulty}</Badge>
            </div>
            <h3 className="font-display font-semibold text-ink truncate">{project.title}</h3>
          </div>
          <MatchRing percentage={project.matchPercentage} />
        </div>

        <p className="text-sm text-ink/60 mt-2 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.requiredSkills.slice(0, 4).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-line text-xs text-ink/60">
          <span>
            {project.teamSize} members · {project.durationWeeks} weeks · {project.remote ? "Remote" : "On-site"}
          </span>
          <span className="truncate ml-2">{project.ownerUniversity}</span>
        </div>
      </Link>
    </motion.div>
  );
}
