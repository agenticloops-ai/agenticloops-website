interface RadarChartProps {
  dimensions: { id: string; name: string }[];
  values: Record<string, number>;
  maxValue?: number;
  size?: number;
  showLabels?: boolean;
}

function polarToCartesian(angle: number, radius: number, cx: number, cy: number) {
  return {
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2),
  };
}

export function RadarChart({
  dimensions,
  values,
  maxValue = 5,
  size = 400,
  showLabels = true,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const labelMargin = showLabels ? 45 : 10;
  const maxRadius = (size / 2) - labelMargin;
  const angleStep = (2 * Math.PI) / dimensions.length;

  const toPoints = (profile: Record<string, number>) =>
    dimensions
      .map((dim, i) => {
        const value = Math.min((profile[dim.id] ?? 0) / maxValue, 1);
        const angle = i * angleStep;
        return polarToCartesian(angle, value * maxRadius, cx, cy);
      })
      .map(p => `${p.x},${p.y}`)
      .join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Grid circles */}
      {Array.from({ length: maxValue }, (_, i) => i + 1).map(level => (
        <circle
          key={level}
          cx={cx}
          cy={cy}
          r={(level / maxValue) * maxRadius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={1}
          opacity={0.6}
        />
      ))}

      {/* Axis lines + labels */}
      {dimensions.map((dim, i) => {
        const angle = i * angleStep;
        const end = polarToCartesian(angle, maxRadius, cx, cy);
        const labelPos = polarToCartesian(angle, maxRadius + (showLabels ? 20 : 0), cx, cy);

        // Adjust text anchor based on position
        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
        if (labelPos.x < cx - 10) textAnchor = 'end';
        else if (labelPos.x > cx + 10) textAnchor = 'start';

        const dy = labelPos.y > cy + 10 ? '0.8em' : labelPos.y < cy - 10 ? '-0.2em' : '0.35em';

        return (
          <g key={dim.id}>
            <line
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="var(--color-border)"
              strokeWidth={1}
              opacity={0.4}
            />
            {showLabels && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor={textAnchor}
                dy={dy}
                fontSize={11}
                fontFamily="'Azeret Mono', monospace"
                fill="var(--color-text-secondary)"
              >
                {dim.name}
              </text>
            )}
          </g>
        );
      })}

      {/* Value polygon */}
      <polygon
        points={toPoints(values)}
        fill="var(--color-accent-cyan)"
        fillOpacity={0.15}
        stroke="var(--color-accent-cyan)"
        strokeWidth={2}
      />

      {/* Value dots */}
      {dimensions.map((dim, i) => {
        const value = Math.min((values[dim.id] ?? 0) / maxValue, 1);
        const angle = i * angleStep;
        const pos = polarToCartesian(angle, value * maxRadius, cx, cy);
        return (
          <circle
            key={`dot-${dim.id}`}
            cx={pos.x}
            cy={pos.y}
            r={3}
            fill="var(--color-accent-cyan)"
          />
        );
      })}
    </svg>
  );
}
