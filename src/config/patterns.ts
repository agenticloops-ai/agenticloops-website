/**
 * Patterns catalog configuration
 * Single source of truth for the agentic-ai-patterns GitHub repo
 */

export const PATTERNS_REPO = 'https://github.com/agenticloops-ai/agentic-ai-patterns';

export function getPatternGitHubUrl(category: string, filename: string): string {
    return `${PATTERNS_REPO}/blob/main/patterns/${category}/${filename}`;
}

export interface PatternData {
    id: string;
    number: string;
    name: string;
    slug: string;
    category: string;
    categoryEmoji: string;
    categoryLabel: string;
    alsoKnownAs: string;
    complexity: string;
    complexityLevel: number; // 1, 2, or 3
    intent: string;
    problemContext: string;
    forces: string[];
    solutionDescription: string;
    diagramMermaid: string;
    diagramDescription: string;
    participants: { component: string; role: string }[];
    useCases: { domain: string; example: string; why: string }[];
    pros: string[];
    cons: string[];
    tradeoffs: { dimension: string; impact: string }[];
    whenToUse: string[];
    whenNotToUse: string[];
    relations: { relationship: string; pattern: string; patternSlug: string; description: string }[];
    realWorldExamples: string[];
    references: string[];
    status: string;
    lastUpdated: string;
    githubUrl: string;
    filename: string;
}

export interface PatternCategory {
    id: string;
    emoji: string;
    label: string;
    description: string;
    color: string;
}

export const PATTERN_CATEGORIES: PatternCategory[] = [
    { id: 'reasoning', emoji: '\u{1F9E0}', label: 'Reasoning', description: 'How agents think', color: 'cyan' },
    { id: 'workflow', emoji: '\u26D3\uFE0F', label: 'Workflow', description: 'How tasks flow through pipelines', color: 'violet' },
    { id: 'orchestration', emoji: '\u{1F3AD}', label: 'Orchestration', description: 'How multiple agents coordinate', color: 'pink' },
    { id: 'memory', emoji: '\u{1F4BE}', label: 'Memory & Context', description: 'How agents retain information', color: 'emerald' },
    { id: 'safety', emoji: '\u{1F6E1}\uFE0F', label: 'Safety & Governance', description: 'How agents stay within bounds', color: 'amber' },
    { id: 'resilience', emoji: '\u{1F501}', label: 'Resilience & Evaluation', description: 'How agents handle failure', color: 'cyan' },
];

export const COMPLEXITY_LEVELS = [
    { level: 1, label: 'Foundation', stars: '\u2605\u2606\u2606' },
    { level: 2, label: 'Intermediate', stars: '\u2605\u2605\u2606' },
    { level: 3, label: 'Advanced', stars: '\u2605\u2605\u2605' },
];

/** Decision flowchart data for interactive component */
export const DECISION_FLOWCHART = {
    nodes: [
        { id: 'start', label: 'What are you building?', type: 'start' as const },
        { id: 'q1', label: 'Single LLM call\nsufficient?', type: 'question' as const },
        { id: 'q2', label: 'Steps known\nin advance?', type: 'question' as const },
        { id: 'q3', label: 'Single agent\nsufficient?', type: 'question' as const },
        { id: 'q4', label: 'Central\ncoordinator?', type: 'question' as const },
        { id: 'a1', label: 'Chain-of-Thought + good prompting', type: 'answer' as const, patternSlug: 'chain-of-thought', color: 'teal' },
        { id: 'a2', label: 'Prompt Chaining or Parallelization', type: 'answer' as const, patternSlug: 'prompt-chaining', color: 'teal' },
        { id: 'a3', label: 'ReAct (Reason + Act loop)', type: 'answer' as const, patternSlug: 'react', color: 'amber' },
        { id: 'a4', label: 'Orchestrator-Workers or Supervisor', type: 'answer' as const, patternSlug: 'orchestrator-workers', color: 'violet' },
        { id: 'a5', label: 'Swarm / Handoff', type: 'answer' as const, patternSlug: 'swarm-handoff', color: 'violet' },
    ],
    edges: [
        { from: 'start', to: 'q1' },
        { from: 'q1', to: 'a1', label: 'Yes' },
        { from: 'q1', to: 'q2', label: 'No' },
        { from: 'q2', to: 'a2', label: 'Yes' },
        { from: 'q2', to: 'q3', label: 'No' },
        { from: 'q3', to: 'a3', label: 'Yes' },
        { from: 'q3', to: 'q4', label: 'No' },
        { from: 'q4', to: 'a4', label: 'Yes' },
        { from: 'q4', to: 'a5', label: 'No' },
    ]
};

/** Relationship map data from README */
export const RELATIONSHIP_MAP = {
    groups: [
        {
            id: 'reasoning',
            label: 'Reasoning',
            emoji: '\u{1F9E0}',
            color: 'cyan',
            patterns: ['chain-of-thought', 'react', 'rewoo', 'tree-of-thoughts', 'reflection', 'reflexion']
        },
        {
            id: 'workflow',
            label: 'Workflow',
            emoji: '\u26D3\uFE0F',
            color: 'violet',
            patterns: ['prompt-chaining', 'routing', 'tool-use', 'parallelization', 'evaluator-optimizer']
        },
        {
            id: 'orchestration',
            label: 'Orchestration',
            emoji: '\u{1F3AD}',
            color: 'pink',
            patterns: ['orchestrator-workers', 'supervisor', 'swarm-handoff', 'hierarchical-teams', 'agent-as-tool']
        },
        {
            id: 'memory',
            label: 'Memory',
            emoji: '\u{1F4BE}',
            color: 'emerald',
            patterns: ['conversation-memory', 'semantic-memory', 'graphrag-memory', 'agentic-rag']
        },
        {
            id: 'safety',
            label: 'Safety',
            emoji: '\u{1F6E1}\uFE0F',
            color: 'amber',
            patterns: ['guardrails', 'human-in-the-loop', 'sandboxed-execution']
        },
        {
            id: 'resilience',
            label: 'Resilience',
            emoji: '\u{1F501}',
            color: 'cyan',
            patterns: ['retry-with-feedback', 'dynamic-re-planning', 'multi-agent-debate']
        },
    ],
    edges: [
        // Reasoning
        { from: 'chain-of-thought', to: 'react', verb: 'extends' },
        { from: 'chain-of-thought', to: 'tree-of-thoughts', verb: 'extends' },
        { from: 'react', to: 'rewoo', verb: 'alternative' },
        { from: 'react', to: 'agentic-rag', verb: 'combines with' },
        { from: 'reflection', to: 'reflexion', verb: 'extends' },
        { from: 'reflection', to: 'evaluator-optimizer', verb: 'extends' },
        { from: 'evaluator-optimizer', to: 'multi-agent-debate', verb: 'extends' },
        // Workflow
        { from: 'tool-use', to: 'react', verb: 'foundation' },
        { from: 'prompt-chaining', to: 'orchestrator-workers', verb: 'scales to' },
        { from: 'prompt-chaining', to: 'routing', verb: 'variant' },
        { from: 'parallelization', to: 'orchestrator-workers', verb: 'feeds' },
        { from: 'routing', to: 'supervisor', verb: 'feeds' },
        // Orchestration
        { from: 'orchestrator-workers', to: 'hierarchical-teams', verb: 'scales to' },
        { from: 'orchestrator-workers', to: 'dynamic-re-planning', verb: 'combines' },
        { from: 'supervisor', to: 'hierarchical-teams', verb: 'scales to' },
        { from: 'agent-as-tool', to: 'tool-use', verb: 'uses' },
        { from: 'agent-as-tool', to: 'hierarchical-teams', verb: 'composes' },
        // Memory
        { from: 'conversation-memory', to: 'semantic-memory', verb: 'extends' },
        { from: 'semantic-memory', to: 'graphrag-memory', verb: 'extends' },
        { from: 'semantic-memory', to: 'agentic-rag', verb: 'combines' },
        // Safety
        { from: 'tool-use', to: 'sandboxed-execution', verb: 'combines' },
        { from: 'guardrails', to: 'human-in-the-loop', verb: 'combines' },
        { from: 'guardrails', to: 'sandboxed-execution', verb: 'combines' },
        // Resilience
        { from: 'retry-with-feedback', to: 'dynamic-re-planning', verb: 'extends' },
        { from: 'retry-with-feedback', to: 'human-in-the-loop', verb: 'escalates to' },
    ]
};
