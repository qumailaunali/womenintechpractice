export type Priority = "Low" | "Medium" | "High";

export type StudyTask = {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  priority: Priority;
  minutes: number;
  completed: boolean;
};

export const starterTasks: StudyTask[] = [
  { id: "algorithms", title: "Dynamic Programming Assignment", subject: "Design and Analysis of Algorithms", deadline: "Tomorrow", priority: "High", minutes: 90, completed: false },
  { id: "calculus", title: "Partial Derivatives Quiz", subject: "Multivariable Calculus", deadline: "In 2 days", priority: "High", minutes: 45, completed: false },
  { id: "entrepreneurship", title: "Entrepreneurship Case Study", subject: "Entrepreneurship", deadline: "In 4 days", priority: "Medium", minutes: 60, completed: false },
];

export const deadlineScore: Record<string, number> = {
  Overdue: 0,
  Today: 1,
  Tomorrow: 2,
  "In 2 days": 3,
  "In 3 days": 4,
  "In 4 days": 5,
  "Next week": 7,
};
