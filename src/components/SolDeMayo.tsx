export function SolDeMayo({ className = '', size = 64 }: { className?: string; size?: number }) {
  const rays = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="solCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE08A" />
          <stop offset="60%" stopColor="#F6B40E" />
          <stop offset="100%" stopColor="#C68900" />
        </radialGradient>
      </defs>
      <g>
        {rays.map(i => {
          const isStraight = i % 2 === 0;
          const rot = (i * 360) / 16;
          return isStraight ? (
            <polygon
              key={i}
              points="0,-44 2.2,-22 -2.2,-22"
              fill="#F6B40E"
              transform={`rotate(${rot})`}
              opacity="0.95"
            />
          ) : (
            <path
              key={i}
              d="M 0,-42 Q 4,-32 0,-22 Q -4,-32 0,-42 Z"
              fill="#F6B40E"
              transform={`rotate(${rot})`}
              opacity="0.85"
            />
          );
        })}
      </g>
      <circle cx="0" cy="0" r="16" fill="url(#solCore)" stroke="#C68900" strokeWidth="1" />
      <circle cx="-5" cy="-4" r="3" fill="#4a2e00" opacity="0.85" />
      <circle cx="5" cy="-4" r="3" fill="#4a2e00" opacity="0.85" />
      <path d="M -6,4 Q 0,9 6,4" stroke="#4a2e00" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}
