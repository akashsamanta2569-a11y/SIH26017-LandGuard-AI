interface LandGuardLogoProps {
    size?: number;
    showText?: boolean;
}

export default function LandGuardLogo({
    size = 42,
    showText = true,
}: LandGuardLogoProps) {
    return (
        <div className="flex items-center gap-3">
            <svg
                width={size}
                height={size}
                viewBox="0 0 64 64"
                fill="none"
            >
                <defs>
                    <linearGradient id="emerald" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#14B8A6" />
                    </linearGradient>
                </defs>

                {/* Shield */}
                <path
                    d="M32 3 L55 12 V30 C55 44 46 54 32 60 C18 54 9 44 9 30 V12 L32 3 Z"
                    stroke="url(#emerald)"
                    strokeWidth="2.8"
                    fill="rgba(16,185,129,0.08)"
                />

                {/* Globe */}
                <circle
                    cx="32"
                    cy="28"
                    r="13"
                    stroke="url(#emerald)"
                    strokeWidth="1.8"
                />

                {/* Leaf */}
                <path
                    d="M24 38 C28 31 34 28 40 22 C40 33 35 42 27 46"
                    fill="#10B981"
                />

                {/* Satellite */}
                <rect x="43" y="6" width="8" height="4" rx="1" fill="#14B8A6" />
                <rect x="46" y="10" width="2" height="5" fill="#14B8A6" />
                <rect x="39" y="8" width="4" height="2" fill="#10B981" />
                <rect x="51" y="8" width="4" height="2" fill="#10B981" />

                {/* Orbit */}
                <path
                    d="M17 18 C25 12 39 12 47 20"
                    stroke="#34D399"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                />
            </svg>

            {showText && (
                <div className="leading-tight">
                    <h1 className="font-bold text-white text-lg">
                        LandGuard <span className="text-emerald-400">AI</span>
                    </h1>

                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                        SIH 2026 • Satellite Intelligence
                    </p>
                </div>
            )}
        </div>
    );
}