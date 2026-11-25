/* The little rally car (top-down, facing +x, centred on 0,0). Used by the journey map and the logbook. */

export function CarShape({ beamId }: { beamId: string }) {
  return (
    <>
      {/* headlight beams: only visible in dark mode */}
      <path className="car-beam" d="M14 -5 L78 -26 L78 26 L14 5 Z" fill={`url(#${beamId})`} />
      <rect x={-13.5} y={-6.5} width={30} height={16} rx={5} fill="black" opacity={0.18} />
      {/* wheels */}
      <rect x={-11} y={-9.6} width={6.5} height={3} rx={1} fill="#1b1c19" />
      <rect x={5} y={-9.6} width={6.5} height={3} rx={1} fill="#1b1c19" />
      <rect x={-11} y={6.6} width={6.5} height={3} rx={1} fill="#1b1c19" />
      <rect x={5} y={6.6} width={6.5} height={3} rx={1} fill="#1b1c19" />
      {/* body */}
      <rect x={-15} y={-8} width={30} height={16} rx={5} fill="#f6f4ee" stroke="#141512" strokeWidth={0.9} />
      <rect x={-15} y={-1.7} width={30} height={3.4} fill="var(--accent)" />
      <rect x={1.5} y={-6} width={5.5} height={12} rx={1.6} fill="#22302e" />
      <rect x={-11.5} y={-5.5} width={3.6} height={11} rx={1.2} fill="#22302e" />
      <rect x={-7.4} y={-6} width={8.4} height={12} rx={1.8} fill="#e9e6dc" stroke="#141512" strokeWidth={0.5} />
      <circle cx={-3.2} cy={0} r={2.6} fill="#f6f4ee" stroke="#141512" strokeWidth={0.5} />
      <rect x={13.6} y={-6.4} width={1.6} height={2.6} rx={0.6} fill="#ffe7a3" />
      <rect x={13.6} y={3.8} width={1.6} height={2.6} rx={0.6} fill="#ffe7a3" />
    </>
  );
}

export function BeamGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#fff6d6" stopOpacity={0.55} />
      <stop offset="1" stopColor="#fff6d6" stopOpacity={0} />
    </linearGradient>
  );
}
