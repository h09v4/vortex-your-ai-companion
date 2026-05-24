import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Upload, Trash2 } from "lucide-react";
import { useVortexUI } from "@/hooks/useVortexUI";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const models = ["Gemini 2.0 Flash", "GPT-5.4", "Groq Llama 3", "Grok 4", "Claude Sonnet"];
const languages = ["English", "Arabic", "Hindi/Urdu"];

function SettingsPage() {
  const { backgroundUrl, setBackgroundUrl, userName, setUserName } = useVortexUI();
  const [model, setModel] = useState("Gemini 2.0 Flash");
  const [lang, setLang] = useState("English");
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState("vortex_sk_••••••••••••••••");
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [voicePitch, setVoicePitch] = useState(1);
  const [wakeWord, setWakeWord] = useState("Hey Vortex");
  const [pin, setPin] = useState("");

  const onBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setBackgroundUrl(URL.createObjectURL(f));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <header className="mb-2">
        <div className="hud-label">Module · Settings</div>
        <h1 className="text-2xl text-cream">Configuration</h1>
      </header>

      <Section title="Identity">
        <Row label="Display name">
          <input value={userName} onChange={(e) => setUserName(e.target.value)} className="glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none w-64" />
        </Row>
        <Row label="PIN">
          <input value={pin} onChange={(e) => setPin(e.target.value)} maxLength={6} placeholder="••••" className="glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none w-32 tracking-widest" />
        </Row>
      </Section>

      <Section title="AI Brain">
        <Row label="Model">
          <select value={model} onChange={(e) => setModel(e.target.value)} className="glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none">
            {models.map((m) => <option key={m} className="bg-background">{m}</option>)}
          </select>
        </Row>
        <Row label="API key">
          <div className="flex items-center gap-2">
            <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none w-72 font-mono" />
            <button onClick={() => setShowKey((s) => !s)} className="glass glass-hover h-9 w-9 rounded-lg flex items-center justify-center">
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Row>
        <Row label="Language">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none">
            {languages.map((l) => <option key={l} className="bg-background">{l}</option>)}
          </select>
        </Row>
      </Section>

      <Section title="Voice">
        <Row label="Wake word">
          <input value={wakeWord} onChange={(e) => setWakeWord(e.target.value)} className="glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none w-64" />
        </Row>
        <Row label={`Speed · ${voiceSpeed.toFixed(1)}x`}>
          <input type="range" min={0.5} max={2} step={0.1} value={voiceSpeed} onChange={(e) => setVoiceSpeed(+e.target.value)} className="w-64 accent-[var(--cream)]" />
        </Row>
        <Row label={`Pitch · ${voicePitch.toFixed(1)}`}>
          <input type="range" min={0.5} max={2} step={0.1} value={voicePitch} onChange={(e) => setVoicePitch(+e.target.value)} className="w-64 accent-[var(--cream)]" />
        </Row>
      </Section>

      <Section title="Appearance">
        <Row label="Background video / image">
          <div className="flex items-center gap-2">
            <label className="glass glass-hover rounded-full px-4 py-2 text-[10px] uppercase tracking-widest text-cream cursor-pointer flex items-center gap-2">
              <Upload className="h-3 w-3" /> Upload
              <input type="file" accept="video/*,image/*" className="hidden" onChange={onBgUpload} />
            </label>
            {backgroundUrl && (
              <button onClick={() => setBackgroundUrl(null)} className="glass glass-hover rounded-full px-3 py-2 text-[10px] uppercase tracking-widest text-red-300 flex items-center gap-2">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
          </div>
        </Row>
      </Section>

      <Section title="Permissions">
        {["Microphone", "Camera", "Notifications", "Screen activity", "Desktop integration"].map((p) => (
          <Row key={p} label={p}>
            <Toggle defaultOn={["Microphone", "Notifications"].includes(p)} />
          </Row>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="hud-label mb-4">{title}</div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn((v) => !v)} className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-cream/70" : "bg-white/10"}`}>
      <span className={`absolute top-0.5 ${on ? "left-5" : "left-0.5"} h-5 w-5 rounded-full bg-background border border-border transition-all`} />
    </button>
  );
}
