import { ScrollReveal } from '../ScrollReveal';
import { DimensionCard } from './DimensionCard';
import dimensions from '../../data/dimensions.json';
import contentCatalog from '../../data/content-catalog.json';

const colorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber', 'rose', 'sky', 'orange'] as const;

export function DimensionGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dimensions.map((dim, i) => {
        const colorClass = colorClasses[i % colorClasses.length];
        const contentCount = contentCatalog.filter(item =>
          item.dimensions.some(d => d.dimension === dim.id)
        ).length;

        return (
          <ScrollReveal key={dim.id} delay={i * 0.05}>
            <DimensionCard
              dimension={dim}
              colorClass={colorClass}
              contentCount={contentCount}
            />
          </ScrollReveal>
        );
      })}
    </div>
  );
}
