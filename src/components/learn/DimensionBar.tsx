interface DimensionBarProps {
  name: string;
  level: number;
  maxLevel?: number;
  colorClass: string;
}

export function DimensionBar({ name, level, maxLevel = 5, colorClass }: DimensionBarProps) {
  const percentage = (level / maxLevel) * 100;

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm text-text-secondary font-mono w-40 shrink-0 truncate">
        {name}
      </span>
      <div className="flex-1 h-2 bg-border/40 rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: `var(--palette-${colorClass})`,
            boxShadow: `0 0 8px color-mix(in srgb, var(--palette-${colorClass}) 40%, transparent)`,
          }}
        />
      </div>
      <span className="text-xs font-mono text-text-muted w-8 text-right">
        {level}/{maxLevel}
      </span>
    </div>
  );
}
