import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
  accent?: string;
}

export function Widget({ title, children, className = "", accent }: Props) {
  return (
    <div className={`glass glass-hover animate-fade-up rounded-2xl p-4 relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="hud-label">{title}</span>
        {accent && <span className="text-[10px] text-cream/70 tracking-widest">{accent}</span>}
      </div>
      {children}
    </div>
  );
}
