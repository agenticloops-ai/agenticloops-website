import { ScrollReveal } from '../ScrollReveal';
import { ArchetypeCard } from './ArchetypeCard';
import archetypes from '../../data/archetypes.json';
import dimensions from '../../data/dimensions.json';

export function ArchetypeGallery() {
  const dimensionsMeta = dimensions.map(d => ({ id: d.id, name: d.name }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {archetypes.map((archetype, i) => (
        <ScrollReveal key={archetype.id} delay={i * 0.05}>
          <ArchetypeCard
            archetype={archetype}
            dimensions={dimensionsMeta}
          />
        </ScrollReveal>
      ))}
    </div>
  );
}
