import { Mic, Send } from "lucide-react";
import { useState } from "react";

export function VoiceBar({ onSubmit, placeholder = "Speak or type to Vortex..." }: { onSubmit?: (s: string) => void; placeholder?: string }) {
  const [value, setValue] = useState("");
  const submit = () => {
    if (!value.trim()) return;
    onSubmit?.(value);
    setValue("");
  };
  return (
    <div className="glass rounded-full flex items-center gap-2 pl-2 pr-1 py-1 w-full max-w-2xl">
      <button className="glass glass-hover h-10 w-10 rounded-full flex items-center justify-center text-cream">
        <Mic className="h-4 w-4" />
      </button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70 px-2"
      />
      <button onClick={submit} className="glass glass-hover h-10 px-4 rounded-full flex items-center gap-2 text-xs uppercase tracking-widest text-cream">
        <span className="hidden sm:inline">Send</span>
        <Send className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
