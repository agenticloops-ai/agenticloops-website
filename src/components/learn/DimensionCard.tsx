import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface DimensionCardProps {
  dimension: {
    id: string;
    name: string;
    coreQuestion: string;
    description: string;
    icon: string;
    levels: { level: number }[];
  };
  colorClass: string;
  contentCount?: number;
}

function getIcon(iconName: string): LucideIcon {
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return (Icons as unknown as Record<string, LucideIcon>)[pascalCase] || Icons.BookOpen;
}

export function DimensionCard({ dimension, colorClass, contentCount }: DimensionCardProps) {
  const Icon = getIcon(dimension.icon);
  const baseUrl = import.meta.env.BASE_URL || '';

  return (
    <a
      href={`${baseUrl}learn/dimensions/${dimension.id}`}
      className={`card card-color-${colorClass} block p-6 h-full no-underline text-inherit group flex flex-col`}
    >
      <div className="icon-box icon-box-outline mb-4">
        <Icon size={20} />
      </div>

      <h4 className="card-title mb-2 flex items-center gap-2">
        {dimension.name}
        <Icons.ChevronRight size={14} className="opacity-40" />
      </h4>

      <p className="text-sm text-text-secondary leading-relaxed mb-3 italic">
        "{dimension.coreQuestion}"
      </p>

      <div className="mt-auto pt-2 flex items-center gap-3 text-xs font-mono text-text-muted">
        <span>{dimension.levels.length} levels</span>
        {contentCount !== undefined && (
          <>
            <span className="opacity-30">|</span>
            <span>{contentCount} items</span>
          </>
        )}
      </div>
    </a>
  );
}
