import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { Application, ApplicationStatus } from "../../data/mockApplications";

const statusTone: Record<ApplicationStatus, "neutral" | "mint" | "ember"> = {
  Pending: "neutral",
  Accepted: "mint",
  Rejected: "ember",
};

interface ApplicationCardProps {
  application: Application;
  /** Owner-review mode shows Accept/Reject; applicant mode is read-only. */
  mode: "applicant" | "owner";
  onAccept?: () => void;
  onReject?: () => void;
}

export function ApplicationCard({ application, mode, onAccept, onReject }: ApplicationCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-semibold">{application.projectTitle}</p>
          {mode === "owner" && (
            <p className="text-ink/50 text-sm">
              {application.applicantName} · {application.applicantUniversity}
            </p>
          )}
        </div>
        <Badge tone={statusTone[application.status]}>{application.status}</Badge>
      </div>

      <p className="text-sm text-ink/70">{application.message}</p>

      <div className="flex flex-wrap gap-1.5">
        {application.relevantSkills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>

      <p className="text-xs text-ink/60">
        Contribution: {application.expectedContribution} · Available: {application.availability}
      </p>

      {mode === "owner" && application.status === "Pending" && (
        <div className="flex gap-2 pt-1">
          <Button variant="primary" onClick={onAccept} className="text-sm px-3 py-1.5">
            Accept
          </Button>
          <Button variant="secondary" onClick={onReject} className="text-sm px-3 py-1.5">
            Reject
          </Button>
        </div>
      )}
    </Card>
  );
}
