import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { NeuralOrb } from "@/components/vortex/NeuralOrb";
import { VoiceBar } from "@/components/vortex/VoiceBar";
import { Plus, Square, Zap, Scale, Brain, Paperclip, X, FileText, Image as ImageIcon, FileArchive, File as FileIcon } from "lucide-react";

export const Route = createFileRoute("/chat")({ component: ChatPage });

interface Attachment { id: string; name: string; size: number; type: string; previewUrl?: string }
interface Msg { id: string; role: "user" | "assistant"; content: string; thinking?: string; attachments?: Attachment[] }

const initialSessions = [
  { id: "s1", title: "Project planning", time: "2h ago" },
  { id: "s2", title: "Trip to Istanbul", time: "Yesterday" },
  { id: "s3", title: "Code review notes", time: "3d ago" },
];

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function iconFor(type: string, name: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (/zip|rar|7z|tar|gz/i.test(type) || /\.(zip|rar|7z|tar|gz)$/i.test(name)) return FileArchive;
  if (type.startsWith("text/") || /\.(md|txt|json|csv|log)$/i.test(name)) return FileText;
  return FileIcon;
}

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m1", role: "assistant", content: "Vortex online. How can I help you?" },
  ]);
  const [reasoning, setReasoning] = useState<"Fast" | "Balanced" | "Deep">("Balanced");
  const [activeSession, setActiveSession] = useState("s1");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = Array.from(files).map((f) => ({
      id: `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setAttachments((a) => [...a, ...next]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((a) => {
      const found = a.find((x) => x.id === id);
      if (found?.previewUrl) URL.revokeObjectURL(found.previewUrl);
      return a.filter((x) => x.id !== id);
    });
  };

  const send = (text: string) => {
    if (!text.trim() && attachments.length === 0) return;
    const userAtts = attachments;
    setMessages((m) => [
      ...m,
      { id: Date.now() + "u", role: "user", content: text, attachments: userAtts.length ? userAtts : undefined },
      {
        id: Date.now() + "a",
        role: "assistant",
        content: userAtts.length
          ? `Received ${userAtts.length} file${userAtts.length > 1 ? "s" : ""}. (Wire Lovable AI Gateway to actually process them.)`
          : "Acknowledged. (Wire Lovable AI Gateway to enable live replies.)",
        thinking: "Parsing intent → routing to default model → composing response.",
      },
    ]);
    setAttachments([]);
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
                {m.content && <div>{m.content}</div>}
                {m.attachments && m.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.attachments.map((a) => {
                      const Icon = iconFor(a.type, a.name);
                      return (
                        <div key={a.id} className="glass rounded-lg px-2 py-1.5 flex items-center gap-2 text-[11px] max-w-[220px]">
                          {a.previewUrl ? (
                            <img src={a.previewUrl} alt="" className="h-8 w-8 rounded object-cover" />
                          ) : (
                            <Icon className="h-4 w-4 text-cream/80 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="truncate text-cream/90">{a.name}</div>
                            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{fmtSize(a.size)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {attachments.map((a) => {
              const Icon = iconFor(a.type, a.name);
              return (
                <div key={a.id} className="glass rounded-lg pl-2 pr-1 py-1.5 flex items-center gap-2 text-[11px] max-w-[220px]">
                  {a.previewUrl ? (
                    <img src={a.previewUrl} alt="" className="h-7 w-7 rounded object-cover" />
                  ) : (
                    <Icon className="h-4 w-4 text-cream/80 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-cream/90">{a.name}</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{fmtSize(a.size)}</div>
                  </div>
                  <button
                    onClick={() => removeAttachment(a.id)}
                    className="ml-1 rounded p-1 hover:bg-white/10 text-muted-foreground hover:text-cream"
                    aria-label="Remove attachment"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
            className="glass glass-hover rounded-full px-3 py-2 text-[10px] uppercase tracking-widest text-cream flex items-center gap-1.5"
          >
            <Paperclip className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Attach</span>
          </button>
          <button className="glass glass-hover rounded-full px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Square className="h-3 w-3" /> Stop
          </button>
          <VoiceBar onSubmit={send} placeholder="Message Vortex..." />
        </div>
      </section>
    </div>
  );
}
