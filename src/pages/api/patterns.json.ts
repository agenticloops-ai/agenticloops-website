import type { APIRoute } from 'astro';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { PatternData } from '../../config/patterns';
import { getPatternGitHubUrl } from '../../config/patterns';

const PATTERNS_DIR = join(process.cwd(), '.patterns-clone', 'patterns');

const CATEGORY_META: Record<string, { emoji: string; label: string; order: number }> = {
    reasoning: { emoji: '\u{1F9E0}', label: 'Reasoning', order: 1 },
    workflow: { emoji: '\u26D3\uFE0F', label: 'Workflow', order: 2 },
    orchestration: { emoji: '\u{1F3AD}', label: 'Orchestration', order: 3 },
    memory: { emoji: '\u{1F4BE}', label: 'Memory & Context', order: 4 },
    safety: { emoji: '\u{1F6E1}\uFE0F', label: 'Safety & Governance', order: 5 },
    resilience: { emoji: '\u{1F501}', label: 'Resilience & Evaluation', order: 6 },
};

function parseComplexity(text: string): { complexity: string; level: number } {
    if (text.includes('\u2605\u2605\u2605')) return { complexity: '\u2605\u2605\u2605 Advanced', level: 3 };
    if (text.includes('\u2605\u2605\u2606')) return { complexity: '\u2605\u2605\u2606 Intermediate', level: 2 };
    return { complexity: '\u2605\u2606\u2606 Foundation', level: 1 };
}

/**
 * Split the markdown content into sections by ## headings.
 * Returns a map of normalized heading key -> content.
 */
function splitSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    // Split by ## headings (level 2). Each match group: heading text, body
    const parts = content.split(/\n##\s+/);

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const newlineIdx = part.indexOf('\n');
        if (newlineIdx === -1) continue;
        const heading = part.substring(0, newlineIdx).trim();
        const body = part.substring(newlineIdx + 1).trim();

        // Normalize heading: remove emojis, special chars, lowercase
        // Emojis are typically at the start: "🎯 Intent" -> "intent"
        const normalized = heading
            .replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u{1F900}-\u{1F9FF}]|[\u200d\u20e3\ufe0f]/gu, '')
            .trim()
            .toLowerCase();

        sections[normalized] = body;
    }

    return sections;
}

/**
 * Extract a subsection (### heading) from a section body
 */
function extractSubsection(body: string, keyword: string): string {
    const regex = new RegExp(`###\\s+.*?${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?\n([\\s\\S]*?)(?=\\n###|$)`, 'i');
    const match = body.match(regex);
    return match ? match[1].trim() : '';
}

function extractBulletPoints(section: string): string[] {
    return section
        .split('\n')
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.trim().replace(/^- /, ''));
}

function extractTable(section: string): { [key: string]: string }[] {
    const lines = section.split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 3) return [];

    const headers = lines[0].split('|').filter(c => c.trim()).map(c => c.trim().toLowerCase().replace(/\*\*/g, ''));
    const rows = lines.slice(2);

    return rows.map(row => {
        const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
        const obj: { [key: string]: string } = {};
        headers.forEach((h, i) => {
            obj[h] = cells[i] || '';
        });
        return obj;
    });
}

function extractMermaid(section: string): string {
    const match = section.match(/```mermaid\n([\s\S]*?)```/);
    return match ? match[1].trim() : '';
}

function extractPatternSlugFromLink(text: string): string {
    const match = text.match(/\[([^\]]+)\]\([^)]*?([^/]+)\.md\)/);
    if (match) return match[2];
    return text.replace(/\[|\]|\([^)]*\)/g, '').trim()
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Find a section by trying multiple key variants
 */
function findSection(sections: Record<string, string>, ...keywords: string[]): string {
    for (const kw of keywords) {
        // Try exact
        if (sections[kw]) return sections[kw];
        // Try partial match
        for (const key of Object.keys(sections)) {
            if (key.includes(kw)) return sections[key];
        }
    }
    return '';
}

function getFirstParagraph(text: string): string {
    const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('```') && !l.startsWith('|') && !l.startsWith('>'));
    return lines[0] || '';
}

function parsePattern(content: string, category: string, filename: string): PatternData {
    const categoryMeta = CATEGORY_META[category] || { emoji: '', label: category, order: 99 };
    const sections = splitSections(content);

    // Extract header metadata
    const titleMatch = content.match(/^# (.+)/m);
    const fullTitle = titleMatch ? titleMatch[1].trim() : filename.replace('.md', '');
    const numberMatch = fullTitle.match(/^(\d+\.\d+)\s+/);
    const number = numberMatch ? numberMatch[1] : '';
    const name = fullTitle.replace(/^\d+\.\d+\s+/, '');

    const akaMatch = content.match(/Also Known As:\*\*\s*(.+)/);
    const alsoKnownAs = akaMatch ? akaMatch[1].trim() : '';

    const complexityMatch = content.match(/Complexity:\*\*\s*(.+)/);
    const { complexity, level } = parseComplexity(complexityMatch ? complexityMatch[1] : '');

    // Intent
    const intentSection = findSection(sections, 'intent');
    const intent = getFirstParagraph(intentSection);

    // Problem & Forces
    const problemSection = findSection(sections, 'problem');
    const contextSub = extractSubsection(problemSection, 'Context');
    const problemContext = contextSub || getFirstParagraph(problemSection);
    const forcesSub = extractSubsection(problemSection, 'Forces');
    const forces = extractBulletPoints(forcesSub || problemSection);

    // Solution
    const solutionSection = findSection(sections, 'solution');
    const solutionDesc = extractSubsection(solutionSection, 'Description');
    const solutionDescription = solutionDesc ? getFirstParagraph(solutionDesc) : getFirstParagraph(solutionSection);

    const diagramMermaid = extractMermaid(solutionSection);
    const diagDescMatch = solutionSection.match(/\*\*Diagram Description:\*\*\s*(.+)/);
    const diagramDescription = diagDescMatch ? diagDescMatch[1].trim() : '';

    // Participants
    const participantsBody = extractSubsection(solutionSection, 'Participants') || findSection(sections, 'participants');
    const participantsTable = extractTable(participantsBody || solutionSection);
    const participants = participantsTable
        .filter(row => row['component'] || row['role'])
        .map(row => ({
            component: (row['component'] || '').replace(/\*\*/g, ''),
            role: row['role'] || ''
        }));

    // Use Cases
    const useCasesSection = findSection(sections, 'use cases');
    const useCasesTable = extractTable(useCasesSection);
    const useCases = useCasesTable.map(row => ({
        domain: row['domain'] || '',
        example: row['example'] || '',
        why: row['why this pattern'] || row['why'] || ''
    }));

    // Pros and Cons
    const prosConsSection = findSection(sections, 'pros and cons');
    const prosSub = extractSubsection(prosConsSection, 'Pros');
    const consSub = extractSubsection(prosConsSection, 'Cons');
    const pros = extractBulletPoints(prosSub);
    const cons = extractBulletPoints(consSub);

    const tradeoffsSub = extractSubsection(prosConsSection, 'Trade-offs');
    const tradeoffsTable = extractTable(tradeoffsSub);
    const tradeoffs = tradeoffsTable.map(row => ({
        dimension: (row['dimension'] || '').replace(/\*\*/g, ''),
        impact: row['impact'] || ''
    }));

    // When to use / When NOT to use
    const whenUseSection = findSection(sections, 'when to use');
    const whenToUse = extractBulletPoints(whenUseSection);

    const whenNotSection = findSection(sections, 'when not to use');
    const whenNotToUse = extractBulletPoints(whenNotSection);

    // Relations
    const relationsSection = findSection(sections, 'relations with other patterns', 'relations');
    const relationsTable = extractTable(relationsSection);
    const relations = relationsTable.map(row => ({
        relationship: (row['relationship'] || '').replace(/\*\*/g, ''),
        pattern: (row['pattern'] || '').replace(/\[|\]|\([^)]*\)/g, '').replace(/\*\*/g, ''),
        patternSlug: extractPatternSlugFromLink(row['pattern'] || ''),
        description: row['description'] || ''
    }));

    // Real-world examples
    const examplesSection = findSection(sections, 'real-world examples');
    const realWorldExamples = extractBulletPoints(examplesSection);

    // References
    const refsSection = findSection(sections, 'references');
    const references = extractBulletPoints(refsSection);

    // Status - extract short label (Canonical, Established, Draft)
    const statusMatch = content.match(/Pattern Status:\s*(.+?)\*/);
    const statusRaw = statusMatch ? statusMatch[1].trim() : '';
    // Parse: "🏛️ Canonical — Foundational pattern..." -> "Canonical"
    const statusLabel = statusRaw.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u{1F900}-\u{1F9FF}]|[\u200d\u20e3\ufe0f\u2705]/gu, '').trim();
    const status = statusLabel.split('—')[0].split('\u2014')[0].split('-')[0].trim() || statusRaw;

    const dateMatch = content.match(/Last Updated:\s*(.+?)\*/);
    const lastUpdated = dateMatch ? dateMatch[1].trim() : '';

    const slug = filename.replace('.md', '');

    return {
        id: `${category}/${slug}`,
        number,
        name,
        slug,
        category,
        categoryEmoji: categoryMeta.emoji,
        categoryLabel: categoryMeta.label,
        alsoKnownAs,
        complexity,
        complexityLevel: level,
        intent,
        problemContext,
        forces,
        solutionDescription,
        diagramMermaid,
        diagramDescription,
        participants,
        useCases,
        pros,
        cons,
        tradeoffs,
        whenToUse,
        whenNotToUse,
        relations,
        realWorldExamples,
        references,
        status,
        lastUpdated,
        githubUrl: getPatternGitHubUrl(category, filename),
        filename,
    };
}

export const GET: APIRoute = async () => {
    try {
        const categories = await readdir(PATTERNS_DIR);
        const allPatterns: PatternData[] = [];

        for (const category of categories) {
            const categoryPath = join(PATTERNS_DIR, category);
            const catMeta = CATEGORY_META[category];
            if (!catMeta) continue;

            try {
                const files = await readdir(categoryPath);
                for (const file of files) {
                    if (!file.endsWith('.md')) continue;
                    try {
                        const content = await readFile(join(categoryPath, file), 'utf-8');
                        const pattern = parsePattern(content, category, file);
                        allPatterns.push(pattern);
                    } catch {
                        // skip unreadable files
                    }
                }
            } catch {
                // skip unreadable directories
            }
        }

        // Sort by category order then by number
        allPatterns.sort((a, b) => {
            const catOrderA = CATEGORY_META[a.category]?.order ?? 99;
            const catOrderB = CATEGORY_META[b.category]?.order ?? 99;
            if (catOrderA !== catOrderB) return catOrderA - catOrderB;
            return a.number.localeCompare(b.number);
        });

        return new Response(JSON.stringify(allPatterns), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to load patterns', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
