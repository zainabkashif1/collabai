import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/Button";
import { StatCard } from "../components/dashboard/StatCard";
import { MyProjectCard } from "../components/dashboard/MyProjectCard";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectsContext";
import { useApplications } from "../context/ApplicationsContext";
import { getMyProjects, getTeamMembers } from "../utils/team";
import {
  ArrowRightIcon,
  BellIcon,
  ClipboardCheckIcon,
  CompassIcon,
  FolderIcon,
  PlusIcon,
  UsersIcon,
} from "../components/ui/Icon";

const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { applications } = useApplications();

  const name = user?.name ?? "You";
  const myProjects = getMyProjects(name, projects, applications);
  const projectsOwned = projects.filter((p) => p.ownerName === name).length;
  const pendingMine = applications.filter((a) => a.applicantName === name && a.status === "Pending").length;
  const ownedProjectIds = new Set(projects.filter((p) => p.ownerName === name).map((p) => p.id));
  const toReview = applications.filter((a) => ownedProjectIds.has(a.projectId) && a.status === "Pending").length;

  const stats = [
    { label: "Projects owned", value: projectsOwned, icon: <FolderIcon className="h-4 w-4" /> },
    { label: "Teams you're on", value: myProjects.length, icon: <UsersIcon className="h-4 w-4" /> },
    {
      label: "Your pending applications",
      value: pendingMine,
      icon: <ClipboardCheckIcon className="h-4 w-4" />,
      href: "/applications",
      hint: pendingMine > 0 ? "Awaiting a decision" : undefined,
    },
    {
      label: "Applications to review",
      value: toReview,
      icon: <BellIcon className="h-4 w-4" />,
      href: "/applications",
      hint: toReview > 0 ? "Needs your input" : undefined,
    },
  ];

  return (
    <PageTransition>
      <div className="dashboard-page max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-3">{todayLabel}</p>
            <h1 className="font-display text-4xl lg:text-6xl font-semibold tracking-tight leading-[0.95]">
              {greeting()}
              <span className="text-ember">.</span>
              {user ? ` ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-ink/55 text-base mt-4 max-w-md">Your projects, people, and next big idea in one place.</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link to="/discover">
              <Button variant="secondary" className="rounded-full px-5">
                <CompassIcon className="h-4 w-4" />
                Discover
              </Button>
            </Link>
            <Link to="/projects/new">
              <Button variant="primary" className="rounded-full px-5">
                <PlusIcon className="h-4 w-4" />
                New project
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} delay={index * 0.06} {...stat} />
          ))}
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="eyebrow mb-2">Your workspace</p>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-2xl font-semibold tracking-tight">My projects & teams</h2>
              {myProjects.length > 0 && (
                <span className="rounded-full bg-ink/6 px-2.5 py-0.5 font-mono text-xs text-ink/55">
                  {myProjects.length}
                </span>
              )}
            </div>
          </div>
          <Link
            to="/discover"
            className="group flex items-center gap-1 text-signal text-sm font-medium shrink-0"
          >
            Discover more
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {myProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-signal-soft text-signal mb-4">
              <FolderIcon className="h-5 w-5" />
            </div>
            <p className="text-sm text-ink/60 max-w-sm mx-auto">
              You're not on any projects yet. Start one of your own, or apply to a team from Discover.
            </p>
            <div className="flex items-center justify-center gap-2.5 mt-5">
              <Link to="/discover">
                <Button variant="secondary" className="rounded-full px-5">
                  Browse projects
                </Button>
              </Link>
              <Link to="/projects/new">
                <Button variant="primary" className="rounded-full px-5">
                  <PlusIcon className="h-4 w-4" />
                  Create one
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {myProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.06 }}
              >
                <MyProjectCard project={project} team={getTeamMembers(project, applications)} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="dashboard-feature relative mt-10 overflow-hidden rounded-[1.75rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full border-[26px] border-white/10" />
          <div className="relative">
            <p className="eyebrow text-white/55 mb-3">Find your people</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white font-semibold max-w-lg leading-tight">
              Great work starts with the right room.
            </h2>
          </div>
          <Link
            to="/discover"
            className="group relative flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-gold/20 transition-colors hover:bg-ink shrink-0"
          >
            Explore projects
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {toReview > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl bg-signal-soft px-4 py-3 text-sm text-signal flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <BellIcon className="h-4 w-4 shrink-0" />
              You have {toReview} application{toReview > 1 ? "s" : ""} waiting for review.
            </span>
            <Link to="/applications" className="flex items-center gap-1 font-medium shrink-0">
              Review now
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
