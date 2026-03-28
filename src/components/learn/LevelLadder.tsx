import { ContentItemRow } from './ContentItemRow';

interface Level {
  level: number;
  name: string;
  description: string;
  checkpoint: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  url: string;
  estimatedMinutes?: number;
  status: string;
  dimensions: { dimension: string; level: number }[];
}

interface LevelLadderProps {
  levels: Level[];
  contentItems: ContentItem[];
  dimensionId: string;
  colorClass: string;
}

export function LevelLadder({ levels, contentItems, dimensionId, colorClass }: LevelLadderProps) {
  return (
    <div className="relative pl-8">
      {/* Vertical timeline line */}
      <div
        className="absolute left-3 top-2 bottom-2 w-0.5"
        style={{ background: `var(--palette-${colorClass})`, opacity: 0.3 }}
      />

      {levels.map((level, i) => {
        const levelItems = contentItems.filter(item =>
          item.dimensions.some(d => d.dimension === dimensionId && d.level === level.level)
        );
        const hasPublished = levelItems.some(item => item.status === 'published');

        return (
          <div key={level.level} className={i < levels.length - 1 ? 'mb-8' : ''}>
            {/* Level node */}
            <div className="flex items-start gap-4 relative">
              {/* Circle indicator */}
              <div
                className="absolute -left-5 top-1 w-4 h-4 rounded-full border-2 flex-shrink-0"
                style={{
                  borderColor: `var(--palette-${colorClass})`,
                  background: hasPublished
                    ? `var(--palette-${colorClass})`
                    : 'var(--color-bg-primary)',
                  boxShadow: hasPublished
                    ? `0 0 8px color-mix(in srgb, var(--palette-${colorClass}) 50%, transparent)`
                    : 'none',
                }}
              />

              <div className="flex-1">
                {/* Level header */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="label py-0.5 px-2 border"
                    style={{
                      color: `var(--palette-${colorClass})`,
                      borderColor: `var(--palette-${colorClass})`,
                    }}
                  >
                    Level {level.level}
                  </span>
                  <h4 className="text-base font-semibold m-0">{level.name}</h4>
                </div>

                <p className="text-sm text-text-secondary mb-2">{level.description}</p>

                {/* Content items */}
                {levelItems.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {levelItems.map(item => (
                      <ContentItemRow key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {/* Checkpoint */}
                <div
                  className="mt-3 flex items-center gap-2 text-xs font-mono py-1.5 px-3 rounded"
                  style={{
                    background: `color-mix(in srgb, var(--palette-${colorClass}) 8%, transparent)`,
                    color: `var(--palette-${colorClass})`,
                  }}
                >
                  <span className="opacity-60">checkpoint:</span>
                  <span>{level.checkpoint}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
