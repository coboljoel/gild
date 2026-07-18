export default function Logo({ size = 26 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="#D4AF37" strokeWidth="2" />
      <path d="M9.5 19.5l4.5-5 3 3 5.5-6.5" fill="none" stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
