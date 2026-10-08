"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, CalendarDays, Check, Clock3, LayoutDashboard, Lightbulb, LogOut, MessageCircle, NotebookPen, Plus, Sparkles, Target, X } from "lucide-react";
import { useEffect, useState } from "react";
import { deadlineScore, Priority, StudyTask } from "@/lib/study";
import { useStudy } from "./study-provider";

export function Logo() {
  return <span className="brand"><span className="brand-mark"><BookOpen size={20} strokeWidth={2.5} /></span><span>StudyPilot <span style={{ color: "var(--violet)" }}>AI</span></span></span>;
}

export function Sidebar() {
  const pathname = usePathname();
  const { logout: endSession } = useStudy();
  const router = useRouter();
  const logout = async () => { await endSession(); router.push("/login"); };
  return <aside className="sidebar">
    <Logo />
    <nav>
      <Link className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`} href="/dashboard"><LayoutDashboard size={18} />Dashboard</Link>
      <Link className={`nav-link ${pathname === "/planner" ? "active" : ""}`} href="/planner"><CalendarDays size={18} />Study Planner</Link>
    </nav>
    <span className="ai-label"><Sparkles size={12} /> AI POWERED</span>
    <div className="profile">
      <span className="avatar">AS</span><span className="profile-info"><strong>Alex Smith</strong><span>Student account</span></span>
      <button className="icon-button" onClick={logout} aria-label="Log out"><LogOut size={17} /></button>
    </div>
  </aside>;
}

export function AppFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  const { session, hydrated } = useStudy();
  const router = useRouter();
  useEffect(() => { if (hydrated && !session) router.replace("/login"); }, [hydrated, session, router]);
  if (!hydrated || !session) return null;
  return <div className="app-shell"><Sidebar /><main className="content"><div className="mobile-brand"><Logo /></div>{children}</main></div>;
}

export function Header() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return <header className="topbar"><div><h1>{greeting}, Alex</h1><p>Here&apos;s your learning overview for today.</p></div><div className="top-actions"><button className="notification" aria-label="Notifications"><MessageCircle size={18} /></button><span className="avatar">AS</span></div></header>;
}

export function PriorityBadge({ priority }: Readonly<{ priority: Priority }>) {
  return <span className={`priority ${priority.toLowerCase()}`}>{priority}</span>;
}

export function TaskRow({ task }: Readonly<{ task: StudyTask }>) {
  const { toggleTask } = useStudy();
  return <div className={`task-row ${task.completed ? "is-done" : ""}`}>
    <button className={`task-check ${task.completed ? "done" : ""}`} onClick={() => toggleTask(task.id)} aria-label={`${task.completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`}>{task.completed && <Check size={14} />}</button>
    <span className="task-details"><span className="task-title">{task.title}</span><span className="task-meta">{task.subject} · {task.deadline}</span></span>
    <PriorityBadge priority={task.priority} />
  </div>;
}

export function Modal({ onClose }: Readonly<{ onClose: () => void }>) {
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="icon-button" style={{ float: "right" }} onClick={onClose} aria-label="Close"><X size={18} /></button><Lightbulb size={24} color="var(--violet)" /><h3>Coming soon</h3><p>AI Tutor and note summaries are part of the next StudyPilot release. For now, the Smart Study Plan prototype keeps your next session focused.</p><button className="primary-button" onClick={onClose}>Got it</button></div></div>;
}

export function QuickActions({ onComingSoon, onCreate }: Readonly<{ onComingSoon: () => void; onCreate: () => void }>) {
  return <div className="section-card"><div className="section-card-header"><h2>Quick actions</h2><Sparkles size={17} color="var(--violet)" /></div><div className="quick-list">
    <button className="quick-action" onClick={onCreate}><span className="quick-action-icon"><NotebookPen size={17} /></span><span><strong>Create Study Plan</strong><span>Organize your next study session</span></span></button>
    <button className="quick-action" onClick={onComingSoon}><span className="quick-action-icon"><MessageCircle size={17} /></span><span><strong>Ask AI Tutor</strong><span>Get unstuck on tricky topics</span></span></button>
    <button className="quick-action" onClick={onComingSoon}><span className="quick-action-icon"><Lightbulb size={17} /></span><span><strong>Summarize Notes</strong><span>Turn notes into a quick review</span></span></button>
  </div></div>;
}

export function TaskForm({ onGenerated }: Readonly<{ onGenerated: () => void }>) {
  const { addTask } = useStudy();
  const [form, setForm] = useState({ title: "", subject: "", deadline: "Tomorrow", priority: "Medium" as Priority, minutes: "45" });
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.subject.trim()) { setError("Add a task title and subject to continue."); return; }
    const minutes = Number(form.minutes);
    if (!Number.isFinite(minutes) || minutes < 5) { setError("Estimated study time must be at least 5 minutes."); return; }
    addTask({ title: form.title.trim(), subject: form.subject.trim(), deadline: form.deadline, priority: form.priority, minutes });
    setForm({ title: "", subject: "", deadline: "Tomorrow", priority: "Medium", minutes: "45" });
    setError(""); onGenerated();
  };
  return <form className="section-card form-card" onSubmit={submit}><h2>Add a study task</h2><p className="hint">Add an assignment or revision goal. It will be included in your next suggested plan.</p>
    <div className="form-grid"><div className="field"><label htmlFor="task-title">Task title</label><input id="task-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Read chapter 4" /></div>
      <div className="field"><label htmlFor="subject">Subject</label><input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Biology" /></div>
      <div className="field"><label htmlFor="deadline">Deadline</label><select id="deadline" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}><option>Today</option><option>Tomorrow</option><option>In 2 days</option><option>In 3 days</option><option>In 4 days</option><option>Next week</option></select></div>
      <div className="field"><label htmlFor="priority">Priority</label><select id="priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}><option>Low</option><option>Medium</option><option>High</option></select></div>
      <div className="field"><label htmlFor="minutes">Study time (minutes)</label><input id="minutes" type="number" min="5" step="5" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} /></div>
    </div>{error && <p className="field-error">{error}</p>}<div className="form-actions"><button className="primary-button" type="submit"><Plus size={17} /> Add & plan</button></div>
  </form>;
}

export function PlannerResult({ onRegenerate }: Readonly<{ onRegenerate: () => void }>) {
  const { tasks } = useStudy();
  const incomplete = tasks.filter((task) => !task.completed).sort((a, b) => (deadlineScore[a.deadline] ?? 99) - (deadlineScore[b.deadline] ?? 99) || (b.priority === "High" ? 2 : b.priority === "Medium" ? 1 : 0) - (a.priority === "High" ? 2 : a.priority === "Medium" ? 1 : 0));
  const total = incomplete.reduce((sum, task) => sum + task.minutes, 0);
  return <section className="section-card plan-card"><div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}><h2>Your smart study plan</h2><button className="icon-button" onClick={onRegenerate} aria-label="Regenerate plan"><Sparkles size={18} color="var(--violet)" /></button></div><div className="plan-summary"><span>Prototype recommendation · {incomplete.length} tasks</span><strong>{Math.floor(total / 60) ? `${Math.floor(total / 60)}h ` : ""}{total % 60}m total</strong></div>
    {incomplete.length === 0 ? <div className="empty-state"><Target size={25} /><p>You&apos;ve completed every task. Add another goal to generate a new plan.</p></div> : <div className="timeline">{incomplete.map((task, index) => <div key={task.id} className={`plan-item ${task.deadline === "Today" || task.deadline === "Tomorrow" ? "urgent" : ""}`}><span className="order">{index + 1}</span><span className="plan-content"><strong>{task.title}</strong><small>{task.subject} · {task.deadline}</small><span className="plan-badges"><PriorityBadge priority={task.priority} /><span className="duration"><Clock3 size={12} /> {task.minutes} min</span></span><p className="reason">{index === 0 ? "Start here to protect your closest deadline and build momentum." : task.priority === "High" ? "High priority keeps this task ahead of lower-risk work." : "This fits naturally after the urgent tasks are under control."}</p></span></div>)}</div>}
  </section>;
}
