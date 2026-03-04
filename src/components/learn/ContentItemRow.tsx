import { Clock, ExternalLink, BookOpen, Puzzle, FileText, Link } from 'lucide-react';

interface ContentItemRowProps {
  item: {
    id: string;
    title: string;
    type: string;
    url: string;
    estimatedMinutes?: number;
    status: string;
  };
}

const typeConfig: Record<string, { label: string; icon: typeof BookOpen; badgeClass: string }> = {
  tutorial: { label: 'Tutorial', icon: BookOpen, badgeClass: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan' },
  pattern: { label: 'Pattern', icon: Puzzle, badgeClass: 'bg-violet-500/15 text-violet-400 border-violet-400' },
  blog: { label: 'Blog', icon: FileText, badgeClass: 'bg-pink-500/15 text-pink-400 border-pink-400' },
  external: { label: 'External', icon: Link, badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-400' },
};

export function ContentItemRow({ item }: ContentItemRowProps) {
  const config = typeConfig[item.type] || typeConfig.tutorial;
  const TypeIcon = config.icon;
  const isComingSoon = item.status === 'coming-soon';

  return (
    <div
      className={`flex items-center gap-3 py-2 px-3 rounded transition-colors ${
        isComingSoon ? 'opacity-50' : 'hover:bg-white/5'
      }`}
    >
      {/* Type badge */}
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border rounded ${config.badgeClass}`}
        style={{ opacity: isComingSoon ? 0.6 : 1 }}
      >
        <TypeIcon size={10} />
        {config.label}
      </span>

      {/* Title */}
      {isComingSoon ? (
        <span className="flex-1 text-sm text-text-muted">{item.title}</span>
      ) : (
        <a
          href={item.url}
          target={item.type === 'external' ? '_blank' : undefined}
          rel={item.type === 'external' ? 'noopener noreferrer' : undefined}
          className="flex-1 text-sm text-text-primary no-underline hover:text-accent-cyan transition-colors flex items-center gap-1"
        >
          {item.title}
          {item.type === 'external' && <ExternalLink size={12} className="opacity-50" />}
        </a>
      )}

      {/* Time estimate */}
      {item.estimatedMinutes && (
        <span className="flex items-center gap-1 text-xs text-text-muted font-mono whitespace-nowrap">
          <Clock size={11} />
          {item.estimatedMinutes}m
        </span>
      )}

      {/* Coming soon badge */}
      {isComingSoon && (
        <span className="coming-soon-badge">
          <Clock size={9} /> Soon
        </span>
      )}
    </div>
  );
}
