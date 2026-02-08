import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/courses" }),
    schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        order: z.number().optional(),
        status: z.string().optional(),
    }),
});

export const collections = {
    courses,
};
