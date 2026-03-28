 
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { RadarChart } from './RadarChart';

interface Dimension {
  id: string;
  name: string;
}

interface ArchetypeCardProps {
  archetype: {
    id: string;
    name: string;
    description: string;
    icon: string;
    examples: string[];
    targetProfile: Record<string, number>;
  };
  dimensions: Dimension[];
}

function getIcon(iconName: string): LucideIcon {
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return (Icons as unknown as Record<string, LucideIcon>)[pascalCase] || Icons.BookOpen;
}

export function ArchetypeCard({ archetype, dimensions }: ArchetypeCardProps) {
  const Icon = getIcon(archetype.icon);
  const baseUrl = import.meta.env.BASE_URL || '';

  return (
    <a
      href={`${baseUrl}learn/archetypes/${archetype.id}`}
      className="card block p-6 h-full no-underline text-inherit group flex flex-col"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="icon-box flex-shrink-0">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="card-title mb-1 flex items-center gap-2">
            {archetype.name}
            <Icons.ChevronRight size={14} className="opacity-40" />
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed m-0">
            {archetype.description}
          </p>
        </div>
      </div>

      {/* Mini radar preview */}
      <div className="flex justify-center my-2">
        <RadarChart
          dimensions={dimensions}
          values={archetype.targetProfile}
          size={160}
          showLabels={false}
        />
      </div>

      {/* Examples */}
      <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
        {archetype.examples.map(example => (
          <span
            key={example}
            className="text-[10px] font-mono text-text-muted px-2 py-0.5 border border-border rounded"
          >
            {example}
          </span>
        ))}
      </div>
    </a>
  );
}
