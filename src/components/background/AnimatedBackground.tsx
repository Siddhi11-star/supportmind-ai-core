import { useEffect, useRef, useState } from "react";

/**
 * AnimatedBackground
 * - Aurora gradient blobs
 * - Floating glowing orbs
 * - Animated particle canvas
 * - Soft grid overlay
 * - Parallax mouse movement
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(70, Math.floor((width * height) / 24000));
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 265 : 200,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grd.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.a})`);
        grd.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const parallax = (depth: number) => ({
    transform: `translate3d(${mouse.x * depth}px, ${mouse.y * depth}px, 0)`,
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* base radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.09_275_/_0.6),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0.22_0.08_220_/_0.5),transparent_60%)]" />

      {/* aurora blobs */}
      <div
        className="absolute -top-40 -left-40 h-[38rem] w-[38rem] rounded-full blur-3xl animate-aurora"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.22 265 / 0.35), transparent 70%)",
          ...parallax(20),
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[42rem] w-[42rem] rounded-full blur-3xl animate-aurora"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.24 300 / 0.32), transparent 70%)",
          animationDelay: "-6s",
          ...parallax(-25),
        }}
      />
      <div
        className="absolute bottom-[-10rem] left-1/3 h-[34rem] w-[34rem] rounded-full blur-3xl animate-aurora"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.16 200 / 0.28), transparent 70%)",
          animationDelay: "-12s",
          ...parallax(15),
        }}
      />

      {/* floating orbs */}
      <div
        className="absolute left-[15%] top-[20%] h-24 w-24 rounded-full blur-2xl animate-float-orb"
        style={{ background: "oklch(0.68 0.22 265 / 0.5)", ...parallax(35) }}
      />
      <div
        className="absolute right-[18%] top-[55%] h-16 w-16 rounded-full blur-2xl animate-float-orb"
        style={{
          background: "oklch(0.82 0.16 200 / 0.55)",
          animationDelay: "-4s",
          ...parallax(-30),
        }}
      />

      {/* grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

      {/* particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* subtle noise / vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,oklch(0.1_0.03_265_/_0.6))]" />
    </div>
  );
}
