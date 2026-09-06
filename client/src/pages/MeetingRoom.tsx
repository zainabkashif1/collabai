import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { taskTypes, toolRecommendations, type TaskType } from "../data/toolRecommendations";

export default function MeetingRoom() {
  const { roomId = "ROOM" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [taskType, setTaskType] = useState<TaskType>("Coding");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);
  const title = new URLSearchParams(location.search).get("title") || "Team meeting";
  const recommendations = toolRecommendations[taskType];
  const meetingUrl = useMemo(() => `https://meet.jit.si/CollabAI-${roomId}`, [roomId]);

  async function copyInvite() {
    await navigator.clipboard?.writeText(window.location.href);
    setInviteCopied(true);
    window.setTimeout(() => setInviteCopied(false), 2200);
  }

  return (
    <PageTransition>
      <div className="meeting-room min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <header className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => navigate("/meetings")} aria-label="Leave meeting" className="meeting-back">←</button>
            <div className="min-w-0"><p className="truncate font-display text-lg font-semibold text-white">{title}</p><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Room {roomId}</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-2"><Badge tone="mint">LIVE</Badge><Button type="button" variant="secondary" onClick={copyInvite} className="hidden sm:inline-flex">{inviteCopied ? "Invite copied" : "Copy invite"}</Button></div>
        </header>

        <div className="mx-auto grid max-w-[1500px] gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="meeting-video-shell overflow-hidden rounded-2xl">
            <iframe src={`${meetingUrl}#config.prejoinPageEnabled=false`} title={`${title} video meeting`} allow="camera; microphone; fullscreen; display-capture; autoplay" className="h-[62vh] min-h-[430px] w-full border-0" />
          </section>

          <aside className="meeting-side-panel rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between"><div><p className="eyebrow text-white/45">Room tools</p><h2 className="mt-1 font-display text-xl font-semibold">Keep momentum</h2></div><span className="h-2.5 w-2.5 rounded-full bg-mint shadow-[0_0_0_5px] shadow-mint/15" /></div>
            <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs text-white/45">You are joining as</p><p className="mt-1 font-medium">{user?.name || "Student collaborator"}</p></div>
            <button type="button" onClick={() => setIsNotesOpen((open) => !open)} className="mt-6 flex w-full items-center justify-between rounded-xl bg-white/8 px-4 py-3 text-left text-sm transition-colors hover:bg-white/12"><span>Shared meeting notes</span><span>{isNotesOpen ? "−" : "+"}</span></button>
            {isNotesOpen && <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Capture decisions, owners, and next steps..." className="mt-2 h-32 w-full resize-none rounded-xl border border-white/10 bg-white/8 p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-ember" />}
            <div className="mt-7 border-t border-white/10 pt-5"><p className="eyebrow text-white/45">Need a nudge?</p><p className="mt-2 text-sm leading-5 text-white/60">Ask the tool matchmaker what fits the work you are doing together.</p><div className="mt-3 flex flex-wrap gap-1.5">{taskTypes.map((type) => <button key={type} type="button" onClick={() => setTaskType(type)} className={`rounded-full px-2.5 py-1 text-xs transition-colors ${taskType === type ? "bg-gold text-white" : "bg-white/8 text-white/55 hover:bg-white/15"}`}>{type}</button>)}</div></div>
            <div className="interactive-tool-card mt-4 rounded-xl bg-white/8 p-4"><p className="text-xs uppercase tracking-[0.12em] text-white/40">Try {recommendations[0].name}</p><p className="mt-2 text-sm font-medium">{recommendations[0].bestFor}</p><p className="mt-1 text-xs leading-5 text-white/50">{recommendations[0].reason}</p><a href={recommendations[0].url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-gold-soft hover:text-white">Open tool ↗</a></div>
            <button type="button" onClick={copyInvite} className="mt-6 w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/8 sm:hidden">{inviteCopied ? "Invite copied" : "Copy invite"}</button>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
