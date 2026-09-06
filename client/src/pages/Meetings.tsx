import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { PageTransition } from "../components/PageTransition";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useProjects } from "../context/ProjectsContext";
import { taskTypes, toolRecommendations, type TaskType } from "../data/toolRecommendations";

function createRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function Meetings() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [roomName, setRoomName] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [joinCode, setJoinCode] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("Coding");
  const recommendations = toolRecommendations[taskType];

  function createRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const roomId = createRoomId();
    const params = new URLSearchParams({ title: roomName.trim() || "Team meeting" });
    if (projectId) params.set("project", projectId);
    navigate(`/meetings/${roomId}?${params.toString()}`);
  }

  function joinRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const roomId = joinCode.trim().replace(/[^a-z0-9-]/gi, "");
    if (roomId) navigate(`/meetings/${roomId}`);
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-2xl bg-ink px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[32px] border-ember/30" />
          <div className="relative max-w-2xl">
            <Badge tone="ember">MEETING ROOM</Badge>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">Make space for the good ideas.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">Start a live room for your team, share the invite, and keep the next decision close to the work.</p>
          </div>
        </section>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-6 sm:p-8">
            <p className="eyebrow mb-2">Start a room</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Bring your team together</h2>
            <form onSubmit={createRoom} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">
                Meeting name
                <input value={roomName} onChange={(event) => setRoomName(event.target.value)} placeholder="Sprint planning, project review..." className="mt-2 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm outline-none transition-shadow focus:border-signal focus:ring-4 focus:ring-signal/10" />
              </label>
              <label className="block text-sm font-medium">
                Link to a project
                <select value={projectId} onChange={(event) => setProjectId(event.target.value)} className="mt-2 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm outline-none focus:border-signal focus:ring-4 focus:ring-signal/10">
                  <option value="">General team room</option>
                  {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
                </select>
              </label>
              <Button type="submit" className="mt-2 w-full sm:w-auto">Start meeting ↗</Button>
            </form>

            <div className="my-7 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-ink/35">
              <span className="h-px flex-1 bg-line" /> or join an existing room <span className="h-px flex-1 bg-line" />
            </div>
            <form onSubmit={joinRoom} className="flex flex-col gap-2 sm:flex-row">
              <input value={joinCode} onChange={(event) => setJoinCode(event.target.value)} placeholder="Paste room code" aria-label="Meeting room code" className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3.5 py-3 text-sm uppercase outline-none focus:border-signal focus:ring-4 focus:ring-signal/10" />
              <Button type="submit" variant="secondary">Join room</Button>
            </form>
          </Card>

          <Card className="meeting-tip-panel border-0 p-6 text-white sm:p-8">
            <p className="eyebrow text-white/50 mb-2">Before you meet</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight">A room that stays focused.</h2>
            <ul className="mt-6 space-y-5 text-sm text-white/70">
              <li><strong className="text-white">01 / Set an outcome.</strong><br />Name the decision or deliverable you want by the end.</li>
              <li><strong className="text-white">02 / Invite the right people.</strong><br />Share the room code only with your project team.</li>
              <li><strong className="text-white">03 / Keep the work moving.</strong><br />Use the tool guide below when the team gets stuck.</li>
            </ul>
        </Card>
        </div>

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-2">Tool matchmaker</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight">What are you working on?</h2>
            </div>
            <div className="flex gap-1 overflow-x-auto rounded-lg bg-ink/5 p-1">
              {taskTypes.map((type) => <button key={type} type="button" onClick={() => setTaskType(type)} className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${taskType === type ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"}`}>{type}</button>)}
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-ink/55">A starting point for your workflow. Choose based on the task, privacy needs, and the kind of collaboration your team wants.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendations.map((tool, index) => (
              <motion.article key={tool.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="interactive-tool-card rounded-xl border border-line bg-white p-5 shadow-sm shadow-ink/5">
                <div className="flex items-start justify-between gap-3">
                  <div><span className={`tool-dot tool-dot-${tool.accent}`} /><h3 className="mt-3 font-display text-lg font-semibold">{tool.name}</h3></div>
                  <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink/55">{tool.bestFor}</span>
                </div>
                <p className="mt-3 text-sm leading-5 text-ink/60">{tool.reason}</p>
                <a href={tool.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-semibold text-signal hover:underline">Open {tool.name} ↗</a>
              </motion.article>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-ink/40">Meetings open in a secure Jitsi room. No separate account is needed for your teammates to join.</p>
        <Link to="/dashboard" className="sr-only">Back to dashboard</Link>
      </div>
    </PageTransition>
  );
}
