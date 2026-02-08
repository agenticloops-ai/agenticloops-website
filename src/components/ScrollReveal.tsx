import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    delay?: number;
    className?: string;
}

export function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    className = ''
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const getTransform = () => {
        switch (direction) {
            case 'left': return 'translateX(-60px)';
            case 'right': return 'translateX(60px)';
            case 'down': return 'translateY(-40px)';
            default: return 'translateY(40px)';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0)' : getTransform(),
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

export function StaggerReveal({
    children,
    direction = 'up',
    staggerDelay = 0.1
}: {
    children: ReactNode[];
    direction?: 'left' | 'right' | 'up';
    staggerDelay?: number;
}) {
    return (
        <>
            {children.map((child, i) => (
                <ScrollReveal key={i} direction={direction} delay={i * staggerDelay}>
                    {child}
                </ScrollReveal>
            ))}
        </>
    );
}
