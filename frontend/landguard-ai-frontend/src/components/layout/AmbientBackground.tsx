import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AmbientBackground() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reduce particle count on mobile for performance (Part 9)
  const starCount = isMobile ? 10 : 26;
  const particleCount = isMobile ? 5 : 12;

  // Memoize animated overlays & particle positions (Part 9)
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: `star-${i}`,
      x: (i * 17.3) % 100,
      y: (i * 23.7) % 100,
      size: (i % 3) + 1.2,
      duration: (i % 4) + 3.5,
      delay: (i % 5) * 0.5,
      driftX: ((i % 5) - 2) * 12,
      driftY: ((i % 3) - 1) * 15,
    }));
  }, [starCount]);

  // Subtle floating dust particles
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: `part-${i}`,
      x: (i * 29) % 100,
      y: (i * 37) % 100,
      size: (i % 2) + 1,
      duration: 12 + (i % 6) * 3,
      delay: (i % 4) * 1.2,
    }));
  }, [particleCount]);

  return (
    <div
      data-print="hide"
      className="ambient-bg pointer-events-none fixed inset-0 z-0 overflow-hidden select-none opacity-[0.16]"
      style={{ pointerEvents: "none" }}
    >
      {/* 1. Subtle Deep Space Blue Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050C18] via-[#071122] to-[#040914]" />

      {/* 2. Micro Coordinate Grid Overlay (GPU transforms only) */}
      <motion.div
        animate={{
          x: [0, 48],
          y: [0, 48],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -inset-12 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          willChange: "transform",
        }}
      />

      {/* 3. Subtle Concentric Radar Pulse Rings (Center Right) */}
      <div className="absolute top-1/3 -right-24 h-[500px] w-[500px] sm:h-[640px] sm:w-[640px] -translate-y-1/2 opacity-25 pointer-events-none">
        {/* Outermost Radar Expanding Wave Pulse */}
        <motion.div
          animate={{
            scale: [0.8, 1.25, 0.8],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
          className="absolute inset-0 rounded-full border border-[#00F5C3]/20 shadow-[0_0_30px_rgba(0,245,195,0.08)]"
        />

        {/* Rotating Radar Sweep Line */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
          className="absolute inset-0 rounded-full"
        >
          <div className="h-1/2 w-1/2 origin-bottom-right bg-gradient-to-br from-transparent via-[#00F5C3]/10 to-transparent" />
        </motion.div>

        {/* Counter-rotating dashed ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
          className="absolute inset-20 rounded-full border border-dashed border-[#00E5FF]/25"
        />

        {/* Inner concentric rings */}
        <div className="absolute inset-40 rounded-full border border-[#00F5C3]/15" />
        <div className="absolute inset-60 rounded-full border border-[#00E5FF]/10" />
      </div>

      {/* 4. GPU-friendly Moving Stars with subtle drift */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{
            opacity: [0.1, 0.75, 0.1],
            scale: [0.75, 1.25, 0.75],
            x: [0, star.driftX, 0],
            y: [0, star.driftY, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            willChange: "transform, opacity",
          }}
          className="absolute rounded-full bg-[#00F5C3] shadow-[0_0_4px_#00F5C3]"
        />
      ))}

      {/* 5. Very subtle drifting ambient particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: ["0vh", "-30vh"],
            x: ["0px", `${(p.id.length % 2 === 0 ? 1 : -1) * 20}px`],
            opacity: [0, 0.45, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            willChange: "transform, opacity",
          }}
          className="absolute rounded-full bg-[#00E5FF]/60 blur-[0.5px]"
        />
      ))}
    </div>
  );
}
