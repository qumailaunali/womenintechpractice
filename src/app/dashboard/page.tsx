"use client";

import Link from "next/link";
import { CheckCircle2, ListChecks, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppFrame, Header, Modal, QuickActions, TaskRow } from "@/components/study-ui";
import { useStudy } from "@/components/study-provider";

export default function DashboardPage() {
  const { tasks } = useStudy();
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  return <AppFrame><Header /><section className="hero"><div className="hero-copy"><p className="eyebrow" style={{ color: "#dcd8ff" }}>A little progress, every day</p><h2>Make today count.</h2><p>Stay focused, keep learning, and make progress toward your goals.</p><Link className="primary-button" href="/planner">Create Study Plan</Link></div><div className="mini-schedule"><small>YOUR FOCUS TODAY</small><strong>{pending ? `${pending} tasks ready to go` : "All caught up!"}</strong><div className="mini-progress"><span style={{ width: `${progress}%` }} /></div><small style={{ display: "block", marginTop: 8 }}>{progress}% complete</small></div></section>
    <section className="stats-grid"><Stat label="Total tasks" value={tasks.length} icon={<ListChecks size={17} />} /><Stat label="Completed" value={completed} icon={<CheckCircle2 size={17} />} /><Stat label="Pending" value={pending} icon={<Target size={17} />} /><Stat label="Study progress" value={`${progress}%`} icon={<Target size={17} />} /></section>
    <section className="dashboard-grid"><div className="section-card"><div className="section-card-header"><h2>Today&apos;s tasks</h2><span>{pending} remaining</span></div>{tasks.length ? <div className="task-list">{tasks.map((task) => <TaskRow key={task.id} task={task} />)}</div> : <div className="empty-state"><Target size={25} /><p>Your task list is clear. Add a new goal to keep your momentum going.</p><Link className="secondary-button" href="/planner">Add a task</Link></div>}</div><QuickActions onComingSoon={() => setModal(true)} onCreate={() => router.push("/planner")} /></section>{modal && <Modal onClose={() => setModal(false)} />}<p className="demo-note" style={{ textAlign: "left", marginTop: 28 }}>StudyPilot AI is a local prototype. Tasks are saved in this browser only.</p></AppFrame>;
}

function Stat({ label, value, icon }: Readonly<{ label: string; value: string | number; icon: React.ReactNode }>) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong className="stat-value">{value}</strong></div>;
}
