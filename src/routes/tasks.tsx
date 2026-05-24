import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Flag, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

type Priority = "high" | "medium" | "low";
interface Task { id: string; title: string; priority: Priority; category: string; done: boolean; due: string }

const seed: Task[] = [
  { id: "1", title: "Finish VORTEX hero animation", priority: "high", category: "work", done: false, due: "Today" },
  { id: "2", title: "30 min cardio", priority: "medium", category: "health", done: false, due: "Today" },
  { id: "3", title: "Call mom", priority: "low", category: "personal", done: true, due: "Yesterday" },
  { id: "4", title: "Ship analytics dashboard", priority: "high", category: "work", done: false, due: "Tomorrow" },
  { id: "5", title: "Read 20 pages", priority: "low", category: "personal", done: false, due: "Today" },
];

const priorityColor: Record<Priority, string> = {
  high: "text-red-400",
  medium: "text-amber-300",
  low: "text-emerald-400",
};

function TasksPage() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [tasks, setTasks] = useState(seed);
  const [input, setInput] = useState("");

  const toggle = (id: string) => setTasks((t) => t.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  const add = () => {
    if (!input.trim()) return;
    setTasks((t) => [{ id: Date.now() + "", title: input, priority: "medium", category: "personal", done: false, due: "Today" }, ...t]);
    setInput("");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <div>
          <div className="hud-label">Module · Tasks</div>
          <h1 className="text-2xl text-cream">Mission queue</h1>
        </div>
        <div className="glass rounded-full p-1 flex">
          {(["list", "kanban"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 text-[10px] uppercase tracking-widest rounded-full glass-hover ${view === v ? "glass-active text-cream" : "text-muted-foreground"}`}>{v}</button>
          ))}
        </div>
      </header>

      <div className="glass rounded-2xl p-3 flex items-center gap-2 mb-4">
        <Plus className="h-4 w-4 text-cream/70 ml-2" />
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Create a task (voice or type)..." className="flex-1 bg-transparent outline-none text-sm py-1" />
        <button onClick={add} className="glass glass-hover rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest text-cream">Add</button>
      </div>

      {view === "list" && (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="glass glass-hover rounded-xl px-4 py-3 flex items-center gap-3">
              <button onClick={() => toggle(t.id)} className="text-cream/70">
                {t.done ? <CheckCircle2 className="h-5 w-5 text-cream" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.category} · {t.due}</div>
              </div>
              <Flag className={`h-3.5 w-3.5 ${priorityColor[t.priority]}`} />
            </div>
          ))}
        </div>
      )}

      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["work", "personal", "health"] as const).map((cat) => (
            <div key={cat} className="glass rounded-2xl p-3">
              <div className="hud-label mb-3">{cat}</div>
              <div className="space-y-2">
                {tasks.filter((t) => t.category === cat).map((t) => (
                  <div key={t.id} className="glass glass-hover rounded-xl p-3">
                    <div className={`text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.due}</span>
                      <Flag className={`h-3 w-3 ${priorityColor[t.priority]}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
