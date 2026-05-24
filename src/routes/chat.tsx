import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NeuralOrb } from "@/components/vortex/NeuralOrb";
import { VoiceBar } from "@/components/vortex/VoiceBar";
import { Plus, Square, Zap, Scale, Brain } from "lucide-react";

export const Route = createFileRoute("/chat")({ component: ChatPage });

interface Msg { id: string; role: "user" | "assistant"; content: string; thinking?: string }

const initialSessions = [
  { id: "s1", title: "Project planning", time: "2h ago" },
  { id: "s2", title: "Trip to Istanbul", time: "Yesterday" },
  { id: "s3", title: "Code review notes", time: "3d ago" },
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m1", role: "assistant", content: "Vortex online. How can I help you?" },
  ]);
  const [reasoning, setReasoning] = useState<"Fast" | "Balanced" | "Deep">("Balanced");
  const [activeSession, setActiveSession] = useState("s1");

  const send = (text: string) => {
    setMessages((m) => [
      ...m,
      { id: Date.now() + "u", role: "user", content: text },
      { id: Date.now() + "a", role: "assistant", content: "Acknowledged. (Wire Lovable AI Gateway to enable live replies.)", thinking: "Parsing intent → routing to default model → composing response." },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
      <aside className="hidden md:flex col-span-3 glass rounded-2xl p-3 flex-col">
        <button className="glass glass-hover rounded-xl px-3 py-2 flex items-center gap-2 text-xs uppercase tracking-widest text-cream mb-3">
          <Plus className="h-3.5 w-3.5" /> New session
        </button>
        <div className="hud-label mb-2 px-1">Sessions</div>
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1">
          {initialSessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSession(s.id)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm glass-hover ${activeSession === s.id ? "glass-active text-cream" : "text-muted-foreground"}`}
            >
              <div className="truncate">{s.title}</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60">{s.time}</div>
            </button>
          ))}
        </div>
      </aside>

      <section className="col-span-12 md:col-span-9 glass rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <NeuralOrb size={48} />
            <div>
              <div className="text-sm text-cream">VORTEX</div>
              <div className="hud-label">Context: 12.4k / 128k</div>
            </div>
          </div>
          <div className="flex items-center gap-1 glass rounded-full p-1">
            {([
              ["Fast", Zap],
              ["Balanced", Scale],
              ["Deep", Brain],
            ] as const).map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => setReasoning(label)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest glass-hover ${reasoning === label ? "glass-active text-cream" : "text-muted-foreground"}`}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3 pr-2">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`glass rounded-2xl px-4 py-3 max-w-[80%] text-sm ${m.role === "user" ? "glass-active text-cream" : "text-foreground/90"}`}>
                {m.thinking && (
                  <div className="mb-2 pb-2 border-b border-border/50 text-[11px] text-muted-foreground">
                    <span className="hud-label text-cream/60">▸ Thinking</span> {m.thinking}
                  </div>
                )}
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button className="glass glass-hover rounded-full px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Square className="h-3 w-3" /> Stop
          </button>
          <VoiceBar onSubmit={send} placeholder="Message Vortex..." />
        </div>
      </section>
    </div>
  );
}
