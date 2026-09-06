import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Badge } from "../ui/Badge";
import { ArrowRightIcon, ClockIcon, GlobeIcon } from "../ui/Icon";
import type { Project, Difficulty } from "../../data/mockProjects";
import type { TeamMember } from "../../utils/team";

const difficultyTone: Record<Difficulty, "mint" | "signal" | "ember"> = {
  Beginner: "mint",
  Intermediate: "signal",
  Advanced: "ember",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Small overlapping initials stack — a lightweight stand-in for avatar photos we don't have. */
function TeamStack({ team }: { team: TeamMember[] }) {
  const shown = team.slice(0, 4);
  const extra = team.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((member, i) => (
        <span
          key={`${member.name}-${i}`}
          title={`${member.name}${member.role === "Owner" ? " (Owner)" : ""}`}
          className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-signal-soft font-mono text-[10px] font-semibold text-signal"
        >
          {initials(member.name) || "?"}
        </span>
      ))}
      {extra > 0 && (
        <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-ink/10 font-mono text-[10px] font-semibold text-ink/60">
          +{extra}
        </span>
      )}
    </div>
  );
}

export function MyProjectCard({ project, team }: { project: Project; team: TeamMember[] }) {
  const filled = Math.min(team.length, project.teamSize);
  const fillRatio = project.teamSize > 0 ? filled / project.teamSize : 0;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: "easeOut" }} className="h-full">
      <Link
        to={`/projects/${project.id}`}
        className="project-card group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 hover:border-signal/40 hover:shadow-md hover:shadow-signal/5 transition-all"
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <Badge tone="signal">{project.category}</Badge>
                <Badge tone={difficultyTone[project.difficulty]}>{project.difficulty}</Badge>
              </div>
              <p className="font-display font-semibold text-ink truncate pr-2">{project.title}</p>
            </div>
            <Badge tone={project.status === "Open" ? "mint" : "neutral"}>{project.status}</Badge>
          </div>

          {project.description && (
            <p className="text-xs text-ink/55 mt-2 line-clamp-2 leading-5">{project.description}</p>
          )}
        </div>

        <div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-ink/50 mb-1.5">
              <span>
                {filled} / {project.teamSize} team members
              </span>
              <TeamStack team={team} />
            </div>
            <div className="h-1.5 rounded-full bg-ink/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fillRatio * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-signal"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-line text-xs text-ink/55">
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                {project.durationWeeks}w
              </span>
              <span className="flex items-center gap-1">
                <GlobeIcon className="h-3.5 w-3.5" />
                {project.remote ? "Remote" : "On-site"}
              </span>
            </span>
            <span className="flex items-center gap-1 font-medium text-signal opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
              View
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
