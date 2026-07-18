// A calm coding rhythm that gets interrupted by sharp spikes — the visual
// thesis of the whole dashboard: uninterrupted work is smooth, context
// switches are jagged. Pure inline SVG, respects prefers-reduced-motion
// via the global stylesheet.
function FlowPulse() {
  return (
    <div className="relative h-14 w-full overflow-hidden">
      <svg
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0,28 C40,28 40,28 80,28 C110,28 120,8 140,8 C160,8 165,48 185,48 C205,48 210,28 240,28
             C320,28 320,28 400,28 C430,28 435,20 450,20 C465,20 468,36 483,36 C498,36 502,28 520,28
             C600,28 600,28 680,28 C705,28 712,4 730,4 C748,4 752,52 772,52 C792,52 796,28 820,28
             C900,28 900,28 980,28 C1010,28 1018,16 1035,16 C1052,16 1055,40 1073,40 C1091,40 1096,28 1120,28
             C1150,28 1150,28 1200,28"
          fill="none"
          stroke="url(#pulseGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="pulseGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.15" />
            <stop offset="18%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#FB7185" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#2DD4BF" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="72%" stopColor="#FB7185" stopOpacity="0.95" />
            <stop offset="86%" stopColor="#F5B940" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default FlowPulse;
