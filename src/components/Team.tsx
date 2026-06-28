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
        <section className="section" id="team">
            <div className="container">
                <ScrollReveal direction="up">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="badge">team</span>
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
                            <div className="card h-full text-center group">
                                {/* LinkedIn Icon in Corner */}
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="icon-box-outline absolute top-4 right-4 w-9 h-9 flex items-center justify-center z-10 transition-colors duration-200 hover:border-accent hover:text-accent"
                                >
                                    <Linkedin size={18} />
                                </a>

                                {/* Photo */}
                                <div className="w-[120px] h-[120px] mx-auto mb-6 relative">
                                    <div className="w-full h-full overflow-hidden rounded-full border border-border">
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Name */}
                                <h3 className="text-2xl font-display text-text-primary mb-2">
                                    {member.name}
                                </h3>

                                {/* Role */}
                                <div className="text-sm text-accent font-mono mb-4">
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
