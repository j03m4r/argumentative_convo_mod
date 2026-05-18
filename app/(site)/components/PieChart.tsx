"use client";

interface PieChartProps {
  numerator: number;
  denominator: number;
  size?: number;
}

export default function PieChart({ numerator, denominator, size = 48 }: PieChartProps) {
  const ratio = denominator === 0 ? 0 : Math.min(Math.max(numerator / denominator, 0), 1);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const slicePath =
    ratio === 0
      ? ""
      : ratio >= 1
      ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`
      : (() => {
          const angle = ratio * 2 * Math.PI - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          const largeArc = ratio > 0.5 ? 1 : 0;
          return `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y} Z`;
        })();

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} className="fill-gray-200" />
        {ratio > 0 && <path d={slicePath} className="fill-blood-orange" />}
    </svg>
  );
}