import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { PageTransition } from "../components/PageTransition";
import { ApplicationCard } from "../components/applications/ApplicationCard";
import { useApplications } from "../context/ApplicationsContext";
import { useProjects } from "../context/ProjectsContext";
import { useAuth } from "../context/AuthContext";

type Tab = "mine" | "received";

export default function Applications() {
  const { user } = useAuth();
  const { applications, updateStatus } = useApplications();
  const { projects } = useProjects();
  const [tab, setTab] = useState<Tab>("mine");

  const applicantName = user?.name ?? "You";

  // "Mine" = applications I submitted. "Received" = applications to
  // projects I own — a student can be both an applicant elsewhere and an
  // owner reviewing candidates here, which is the dual role SRS §4.2
  // describes rather than something we invented.
  const myApplications = applications.filter((a) => a.applicantName === applicantName);
  const myProjectIds = new Set(projects.filter((p) => p.ownerName === applicantName).map((p) => p.id));
  const receivedApplications = applications.filter((a) => myProjectIds.has(a.projectId));

  const visible = tab === "mine" ? myApplications : receivedApplications;

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="font-display text-2xl font-semibold mb-1">Applications</h1>
        <p className="text-ink/50 text-sm mb-6">
          Track what you've applied to, and review who's applied to your projects.
        </p>

        <div className="flex gap-1 mb-6 border-b border-line">
          {(["mine", "received"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t ? "border-signal text-signal" : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              {t === "mine" ? "My Applications" : `Received${receivedApplications.length ? ` (${receivedApplications.length})` : ""}`}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {visible.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                mode={tab === "mine" ? "applicant" : "owner"}
                onAccept={() => updateStatus(application.id, "Accepted")}
                onReject={() => updateStatus(application.id, "Rejected")}
              />
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <div className="text-center py-16 text-ink/60 text-sm">
            {tab === "mine"
              ? "You haven't applied to any projects yet — browse Discover to find one."
              : "No applications received yet on projects you own."}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
