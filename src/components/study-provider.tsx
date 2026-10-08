"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { starterTasks, StudyTask } from "@/lib/study";

export type SessionUser = { id: string; email: string; name: string };

type StudyContextValue = {
  tasks: StudyTask[];
  session: boolean;
  user: SessionUser | null;
  hydrated: boolean;
  setUser: (user: SessionUser) => void;
  logout: () => Promise<void>;
  addTask: (task: Omit<StudyTask, "id" | "completed">) => void;
  toggleTask: (id: string) => void;
};

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [tasks, setTasks] = useState<StudyTask[]>(starterTasks);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.ok ? response.json() : { user: null })
      .then((data: { user: SessionUser | null }) => setUser(data.user))
      .catch(() => setUser(null))
      .then(() => {
        const storedTasks = window.localStorage.getItem("studypilot-tasks");
        if (storedTasks) setTasks(JSON.parse(storedTasks) as StudyTask[]);
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("studypilot-tasks", JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
  };

  const value = useMemo(() => ({
    tasks,
    session: user !== null,
    user,
    hydrated,
    setUser,
    logout,
    addTask: (task: Omit<StudyTask, "id" | "completed">) => setTasks((current) => [...current, { ...task, id: crypto.randomUUID(), completed: false }]),
    toggleTask: (id: string) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)),
  }), [tasks, user, hydrated]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error("useStudy must be used inside StudyProvider");
  return context;
}
