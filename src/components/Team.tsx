import { Linkedin } from './BrandIcons';
import { ScrollReveal } from './ScrollReveal';

// Get base URL from Astro (works for both root and subdirectory deployments)
const baseUrl = import.meta.env.BASE_URL || '';

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    photo: string;
    linkedin: string;
}

const team: TeamMember[] = [
    {
        name: 'Alex Mrynskyi',
        role: 'Software Engineer',
        bio: 'Software architect with extensive experience building large-scale data applications and distributed systems. Passionate about designing patterns that scale gracefully — turning complex data challenges into clean, resilient solutions.',
        photo: `${baseUrl}photos/alex.jpg`,
        linkedin: 'https://www.linkedin.com/in/alexmynsky/'
    },
    {
        name: 'Vishal Banthia',
        role: 'Software Engineer',
        bio: 'Platform engineer with deep roots in infrastructure, security, and reliability. Passionate about developer experience — building the tools and platforms that handle the heavy lifting so developers can focus purely on business logic.',
        photo: `${baseUrl}photos/vishal.jpg`,
        linkedin: 'https://www.linkedin.com/in/vishal-banthia-b4191396/'
    },
];

export function Team() {
    return (
        <section className="section relative overflow-hidden" id="team">
            {/* Background Gradient Blurs */}
            <div className="gradient-blur gradient-blur-blue absolute -top-32 -right-[5%] opacity-15"></div>
            <div className="gradient-blur gradient-blur-violet absolute -bottom-32 -left-[5%] opacity-15"></div>
            {/* Section Header Accent - Alternating to Right */}
            <div
                className="absolute top-0 right-0 w-[300px] h-1 shadow-[0_0_20px_var(--color-accent-violet)]"
                style={{ background: 'var(--color-accent-gradient)' }}
            ></div>

            <div className="container">
                <ScrollReveal direction="up">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-10 h-0.5 bg-accent-cyan"></div>
                            <span className="badge">team</span>
                            <div className="w-10 h-0.5 bg-accent-cyan"></div>
                        </div>

                        <h2 className="mb-4">
                            Who We <span className="gradient-text">Are</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {team.map((member, index) => (
                        <ScrollReveal
                            key={member.name}
                            direction="up"
                            delay={index * 0.1}
                            className="h-full"
                        >
                            <div className="relative h-full border-2 border-border-accent bg-accent-cyan/5 p-8 text-center transition-all duration-300 hover:border-accent-cyan hover:shadow-glow group"
                                style={{
                                    clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'
                                }}>
                                {/* LinkedIn Icon in Corner */}
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-border-subtle bg-accent-cyan/5 text-text-muted transition-all duration-200 z-10 hover:border-accent-cyan hover:text-accent-cyan hover:bg-accent-cyan/15 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                    style={{
                                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                                    }}
                                >
                                    <Linkedin size={18} />
                                </a>

                                {/* Photo */}
                                <div className="w-[120px] h-[120px] mx-auto mb-6 relative">
                                    <div className="w-full h-full overflow-hidden border-2 border-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                        style={{
                                            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                                        }}>
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Name */}
                                <h3 className="text-2xl font-bold font-display text-text-primary mb-2">
                                    {member.name}
                                </h3>

                                {/* Role */}
                                <div className="text-sm text-accent-cyan font-mono mb-4 tracking-wider">
                                    {member.role}
                                </div>

                                {/* Bio */}
                                <p className="text-secondary text-sm leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
