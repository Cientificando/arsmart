export default function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 480 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="presentation"
    >
      <rect x="0" y="0" width="480" height="440" rx="24" fill="#1C1E22" />
      <g stroke="#33363C" strokeWidth="1">
        <line x1="40" y1="80" x2="440" y2="80" />
        <line x1="40" y1="180" x2="440" y2="180" />
        <line x1="40" y1="280" x2="440" y2="280" />
        <line x1="40" y1="380" x2="440" y2="380" />
      </g>
      <g>
        <rect x="60" y="60" width="120" height="80" rx="10" fill="#2A2D32" />
        <circle cx="90" cy="90" r="8" fill="#E8721C" />
        <rect x="108" y="84" width="52" height="6" rx="3" fill="#4A4E55" />
        <rect x="108" y="98" width="36" height="6" rx="3" fill="#4A4E55" />

        <rect x="220" y="120" width="200" height="90" rx="10" fill="#2A2D32" />
        <circle cx="250" cy="152" r="8" fill="#E8721C" />
        <rect x="268" y="146" width="120" height="6" rx="3" fill="#4A4E55" />
        <rect x="268" y="160" width="90" height="6" rx="3" fill="#4A4E55" />
        <rect x="240" y="176" width="160" height="20" rx="6" fill="#33363C" />

        <rect x="60" y="220" width="150" height="70" rx="10" fill="#2A2D32" />
        <circle cx="90" cy="248" r="8" fill="#E8721C" />
        <rect x="108" y="242" width="70" height="6" rx="3" fill="#4A4E55" />
        <rect x="108" y="256" width="50" height="6" rx="3" fill="#4A4E55" />

        <rect x="250" y="250" width="170" height="110" rx="10" fill="#2A2D32" />
        <circle cx="280" cy="282" r="8" fill="#E8721C" />
        <rect x="298" y="276" width="100" height="6" rx="3" fill="#4A4E55" />
        <rect x="270" y="300" width="130" height="36" rx="6" fill="#33363C" />

        <rect x="60" y="330" width="330" height="60" rx="10" fill="#2A2D32" />
        <circle cx="90" cy="360" r="8" fill="#E8721C" />
        <rect x="108" y="354" width="200" height="6" rx="3" fill="#4A4E55" />
        <rect x="108" y="368" width="140" height="6" rx="3" fill="#4A4E55" />
      </g>
      <g stroke="#E8721C" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6">
        <path d="M180 100 L220 150" />
        <path d="M210 220 L250 260" />
        <path d="M420 210 L390 250" />
      </g>
    </svg>
  );
}
