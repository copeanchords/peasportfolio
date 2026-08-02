export interface SkillGroup {
  label: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: 'Product',
    items: [
      'PRDs & user stories',
      'Acceptance criteria',
      'Backlog prioritization',
      'Product metrics & analytics',
      'Feature adoption tracking',
      'UAT & launch coordination',
      'Discovery & requirements interviews',
      'Competitor & market research',
      'Roadmap planning',
    ],
  },
  {
    label: 'Agile & Delivery',
    items: [
      'Sprint ceremonies (planning, standups, reviews, retros)',
      'Risk tracking',
      'Cross-functional delivery',
    ],
  },
  {
    label: 'Tools',
    items: ['Jira', 'Figma', 'Notion', 'SQL', 'Google Workspace', 'Git'],
  },
  {
    label: 'AI & LLM',
    items: [
      'OpenAI API',
      'Anthropic API',
      'Prompt engineering',
      'Structured-output design',
      'RAG & embeddings (working knowledge)',
    ],
  },
  {
    label: 'Technical',
    items: [
      'React',
      'Node.js',
      'Python',
      'MongoDB',
      'REST API design & integration',
      'RBAC',
      'Cloud deployment (Vercel)',
    ],
  },
]
