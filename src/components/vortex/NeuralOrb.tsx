import { useEffect, useRef } from "react";

interface Props {
  size?: number;
  className?: string;
}

export function NeuralOrb({ size = 320, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.32;

    type Node = { theta: number; phi: number; speed: number };
    const nodes: Node[] = Array.from({ length: 60 }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.random() * Math.PI,
      speed: 0.001 + Math.random() * 0.003,
    }));

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, size, size);

      // outer glow
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.8);
      grad.addColorStop(0, "rgba(255, 248, 220, 0.18)");
      grad.addColorStop(0.5, "rgba(255, 248, 220, 0.04)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      coreGrad.addColorStop(0, "rgba(255, 248, 220, 0.35)");
      coreGrad.addColorStop(0.6, "rgba(255, 248, 220, 0.06)");
      coreGrad.addColorStop(1, "rgba(255, 248, 220, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // project nodes to 2D
      const projected = nodes.map((n) => {
        n.theta += n.speed;
        const x = radius * Math.sin(n.phi) * Math.cos(n.theta);
        const y = radius * Math.sin(n.phi) * Math.sin(n.theta);
        const z = radius * Math.cos(n.phi);
        const scale = (z + radius * 1.5) / (radius * 2.5);
        return { x: cx + x, y: cy + y, z, scale };
      });

      // connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            const alpha = (1 - dist / 60) * 0.25 * Math.min(a.scale, b.scale);
            ctx.strokeStyle = `rgba(255, 248, 220, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const p of projected) {
        ctx.fillStyle = `rgba(255, 248, 220, ${0.4 + p.scale * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 + p.scale * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // rotating ring
      ctx.strokeStyle = "rgba(255, 248, 220, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, t * 0.005, t * 0.005 + Math.PI * 1.5);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
    />
  );
}
