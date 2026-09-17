export default function Logo({ dark = false }: { dark?: boolean }) {
  const textColor = dark ? "#FFFFFF" : "#1C1E22";
  return (
    <svg width="132" height="28" viewBox="0 0 220 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ARSMART">
      <circle cx="23" cy="23" r="22" fill="#E8721C" />
      <text x="23" y="30" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="17" fill="#FFFFFF">
        AR
      </text>
      <text x="54" y="31" fontFamily="Space Grotesk, sans-serif" fontWeight="600" fontSize="26" letterSpacing="0.5" fill={textColor}>
        SM<tspan fill="#E8721C">ART</tspan>
      </text>
    </svg>
  );
}
