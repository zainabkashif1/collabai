import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { AxiosError } from "axios";
import { PageTransition } from "../components/PageTransition";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { AlertBanner } from "../components/ui/AlertBanner";
import { MatchRing } from "../components/discovery/MatchRing";
import { ApplyForm } from "../components/discovery/ApplyForm";
import { useProjects } from "../context/ProjectsContext";
import { useApplications } from "../context/ApplicationsContext";
import { useAuth } from "../context/AuthContext";
import { getTeamMembers } from "../utils/team";
import type { Difficulty } from "../data/mockProjects";
import type { ApplicationFormValues } from "../validators/application.schema";

const difficultyTone: Record<Difficulty, "mint" | "signal" | "ember"> = {
  Beginner: "mint",
  Intermediate: "signal",
  Advanced: "ember",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { getProjectById, isLoading } = useProjects();
  const { applications, applyToProject, hasApplied } = useApplications();
  const { user } = useAuth();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const project = id ? getProjectById(id) : undefined;
  const team = project ? getTeamMembers(project, applications) : [];

  const applicantName = user?.name ?? "You";
  const alreadyApplied = project ? hasApplied(project.id, applicantName) : false;

  const [applyError, setApplyError] = useState<string | null>(null);

  async function handleApply(values: ApplicationFormValues) {
    if (!project) return;
    try {
      await applyToProject(project.id, values);
      setShowApplyForm(false);
    } catch (err) {
      // Covers the case the backend actually enforces (Application.ts's
      // unique index on project+applicant) — not just a client-side
      // assumption that you haven't applied before.
      setApplyError(
        err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : "Couldn't submit your application. Please try again."
      );
    }
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-8 text-ink/60">Loading project…</div>
      </PageTransition>
    );
  }

  if (!project) {
    return (
      <PageTransition>
        <div className="p-8">
          <p className="text-ink/60">Project not found.</p>
          <Link to="/discover" className="text-signal text-sm">
            ← Back to Discover
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-8 py-10">
        <Link to="/discover" className="text-signal text-sm">
          ← Back to Discover
        </Link>

        <div className="flex items-start justify-between gap-4 mt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge tone="signal">{project.category}</Badge>
              <Badge tone={difficultyTone[project.difficulty]}>{project.difficulty}</Badge>
              <Badge tone={project.status === "Open" ? "mint" : "neutral"}>{project.status}</Badge>
            </div>
            <h1 className="font-display text-2xl font-semibold">{project.title}</h1>
            <p className="text-ink/50 text-sm mt-1">
              {project.ownerName} · {project.ownerUniversity}
            </p>
          </div>
          {project.matchPercentage > 0 && <MatchRing percentage={project.matchPercentage} />}
        </div>

        <Card className="mt-6">
          <h2 className="font-display font-semibold mb-2">About this project</h2>
          <p className="text-sm text-ink/70 leading-relaxed">{project.description}</p>
        </Card>

        <Card className="mt-4">
          <h2 className="font-display font-semibold mb-2">Required skills</h2>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </Card>

        <Card className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-ink/60 text-xs">Team size</p>
            <p className="font-medium">{project.teamSize} members</p>
          </div>
          <div>
            <p className="text-ink/60 text-xs">Duration</p>
            <p className="font-medium">{project.durationWeeks} weeks</p>
          </div>
          <div>
            <p className="text-ink/60 text-xs">Format</p>
            <p className="font-medium">{project.remote ? "Remote" : "On-site"}</p>
          </div>
        </Card>

        <Card className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold">Team</h2>
            <span className="text-xs text-ink/60">
              {team.length} / {project.teamSize} filled
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {team.map((member) => (
              <div key={member.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-signal-soft text-signal flex items-center justify-center text-xs font-semibold shrink-0">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-ink/60 truncate">{member.university}</p>
                </div>
                <Badge tone={member.role === "Owner" ? "signal" : "neutral"}>{member.role}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-6 flex flex-col gap-3">
          {applyError && <AlertBanner message={applyError} />}
          {alreadyApplied ? (
            <Badge tone="mint">Applied — pending review</Badge>
          ) : showApplyForm ? (
            <AnimatePresence>
              <ApplyForm project={project} onSubmit={handleApply} />
            </AnimatePresence>
          ) : (
            <Button variant="primary" onClick={() => setShowApplyForm(true)}>
              Apply to this project
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
