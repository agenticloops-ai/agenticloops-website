import { Linkedin } from './BrandIcons';
import { ScrollReveal } from './ScrollReveal';

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
            <div className="gradient-blur gradient-blur-blue absolute -top-32 -right-[5%] opacity-10"></div>

            <div className="container">
                <ScrollReveal direction="up">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                            <span className="badge">team</span>
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                        </div>

                        <h2 className="mb-4">
                            Who We Are
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {team.map((member, index) => (
                        <ScrollReveal
                            key={member.name}
                            direction="up"
                            delay={index * 0.1}
                            className="h-full"
                        >
                            <div className="card h-full p-8 text-center">
                                {/* LinkedIn Icon */}
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted transition-all hover:border-border-hover hover:text-text-primary"
                                >
                                    <Linkedin size={16} />
                                </a>

                                {/* Photo */}
                                <div className="w-[100px] h-[100px] mx-auto mb-5 rounded-full overflow-hidden border-2 border-border">
                                    <img
                                        src={member.photo}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <h3 className="text-lg font-semibold text-text-primary mb-1">
                                    {member.name}
                                </h3>

                                <div className="text-sm font-mono text-text-muted mb-4">
                                    {member.role}
                                </div>

                                <p className="text-sm text-text-secondary leading-relaxed m-0">
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
