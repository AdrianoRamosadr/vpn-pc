import React from 'react';

interface HxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const HxLogo: React.FC<HxLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions =
    size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';

  return (
    <svg
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${dimensions} shrink-0 ${className}`}
      aria-label="HX Tunnel Logo"
    >
      {/* Sunset circular backdrop */}
      <circle cx="60" cy="40" r="32" fill="#FDE047" />
      <path
        d="M29 46C34 59 46 69 60 69C74 69 86 59 91 46H29Z"
        fill="#F97316"
      />
      <rect x="28" y="42" width="64" height="4" fill="#FB923C" opacity="0.85" />
      <rect x="31" y="49" width="58" height="3.5" fill="#EA580C" opacity="0.8" />

      {/* Broadcast waves */}
      <path
        d="M46 18C54 11 66 11 74 18"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M51 24C56 19.5 64 19.5 69 24"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Solar panel wings */}
      <rect
        x="16"
        y="53"
        width="26"
        height="13"
        rx="2"
        fill="#1E3A8A"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <line x1="25" y1="53" x2="25" y2="66" stroke="#F8FAFC" strokeWidth="1.5" />
      <line x1="34" y1="53" x2="34" y2="66" stroke="#F8FAFC" strokeWidth="1.5" />
      <line x1="16" y1="59.5" x2="42" y2="59.5" stroke="#F8FAFC" strokeWidth="1.5" />

      <rect
        x="78"
        y="53"
        width="26"
        height="13"
        rx="2"
        fill="#1E3A8A"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <line x1="87" y1="53" x2="87" y2="66" stroke="#F8FAFC" strokeWidth="1.5" />
      <line x1="96" y1="53" x2="96" y2="66" stroke="#F8FAFC" strokeWidth="1.5" />
      <line x1="78" y1="59.5" x2="104" y2="59.5" stroke="#F8FAFC" strokeWidth="1.5" />

      {/* Dish antenna */}
      <path
        d="M41 49C45 64 75 64 79 49H41Z"
        fill="#1E3A8A"
        stroke="#0F172A"
        strokeWidth="2.2"
      />
      <rect x="57.5" y="29" width="5" height="20" rx="2.5" fill="#1E3A8A" />
      <circle cx="60" cy="28" r="4.5" fill="#F97316" stroke="#1E3A8A" strokeWidth="2" />

      {/* Navy HX TUNNEL badge */}
      <rect x="10" y="72" width="100" height="28" rx="6" fill="#111C84" />
      <text
        x="60"
        y="91"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="15.5"
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="0.8"
      >
        HX TUNNEL
      </text>
    </svg>
  );
};
