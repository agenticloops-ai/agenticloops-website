import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
    const allCourse = await getCollection('courses');

    // Structure: ai-agents-engineering/01-foundations/01-simple-llm-call
    // parts[0] = course name, parts[1] = module, parts[2] = lesson
    const modules: Record<string, {
        title: string;
        description: string;
        lessons: { title: string; description: string; slug: string; icon: string; status?: string }[];
        order: number;
    }> = {};

    allCourse.forEach((entry) => {
        // Astro 5 loader collections use 'id' instead of 'slug'
        // 'id' usually contains the file path relative to the base
        const slug = entry.id;
        const parts = slug.split('/');

        // Only process actual lessons (not course index or module index)
        // Lessons have 3 parts: course/module/lesson
        if (parts.length === 3) {
            const moduleKey = parts[1]; // e.g., "01-foundations"
            const moduleName = moduleKey.replace(/^\d+-/, '').split('-').map(
                word => word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');

            if (!modules[moduleKey]) {
                // Extract order number from module key (e.g., "01-foundations" -> 1)
                const orderMatch = moduleKey.match(/^(\d+)-/);
                const order = orderMatch ? parseInt(orderMatch[1], 10) : 99;

                modules[moduleKey] = {
                    title: moduleName,
                    description: `Learn about ${moduleName.toLowerCase()}`,
                    lessons: [],
                    order
                };
            }

            const lessonName = parts[2].replace(/\.md$/, ''); // Remove extension if present
            const lessonTitle = entry.data.title || lessonName?.replace(/^\d+-/, '').split('-').map(
                word => word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ') || 'Lesson';

            modules[moduleKey].lessons.push({
                title: lessonTitle,
                description: entry.data.description || '',
                slug: slug.replace(/\.md$/, ''),
                icon: entry.data.icon || 'book-open',
                status: entry.data.status // Fix: Access status from data
            });
        }

        // If it's a module index (2 parts), use its data for module title/description
        if (parts.length === 2) {
            const moduleKey = parts[1];
            if (modules[moduleKey]) {
                if (entry.data.title) modules[moduleKey].title = entry.data.title;
                if (entry.data.description) modules[moduleKey].description = entry.data.description;
            } else {
                const orderMatch = moduleKey.match(/^(\d+)-/);
                const order = orderMatch ? parseInt(orderMatch[1], 10) : 99;

                const moduleName = entry.data.title || moduleKey.replace(/^\d+-/, '').split('-').map(
                    word => word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

                modules[moduleKey] = {
                    title: moduleName,
                    description: entry.data.description || '',
                    lessons: [],
                    order
                };
            }
        }
    });

    // Sort modules by order and lessons by slug
    const sortedModules = Object.keys(modules)
        .sort((a, b) => modules[a].order - modules[b].order)
        .map(key => ({
            id: key,
            title: modules[key].title,
            description: modules[key].description,
            lessons: modules[key].lessons.sort((a, b) => a.slug.localeCompare(b.slug))
        }));

    return new Response(JSON.stringify(sortedModules), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
