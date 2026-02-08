import { getCollection } from 'astro:content';

export async function GET() {
    const course = await getCollection('courses');

    // Only include actual lessons (3 parts: course/module/lesson)
    // Exclude course index (1 part) and module index (2 parts)
    const lessons = course.filter((entry: any) => {
        const id = entry.id;
        const parts = id.split('/');
        return parts.length === 3;
    }).map((entry: any) => ({
        title: entry.data.title,
        description: entry.data.description,
        slug: entry.id.replace(/\.md$/, ''),
        icon: entry.data.icon || 'book-open',
        body: entry.body,
    }));

    const searchIndex = lessons;

    return new Response(JSON.stringify(searchIndex), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
