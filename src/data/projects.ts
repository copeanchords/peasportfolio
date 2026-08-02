export type CategorySlug = 'vibecoded-tools' | 'ai-ml-projects' | 'experiments'

export interface CategoryMeta {
  slug: CategorySlug
  title: string
  description: string
}

// Categories adapted from the brief's suggested set (Side Projects / Open Source /
// Client Work / Hackathons/Experiments) to fit what actually exists right now.
export const categories: CategoryMeta[] = [
  {
    slug: 'vibecoded-tools',
    title: 'Vibecoded Tools',
    description: 'Small, real tools built fast for people who needed them.',
  },
  {
    slug: 'ai-ml-projects',
    title: 'AI & ML Projects',
    description: 'LLM-powered tools and machine-learning builds.',
  },
  {
    slug: 'experiments',
    title: 'Experiments',
    description: 'Smaller builds, integrations, and one-off ideas.',
  },
]

export interface Project {
  slug: string
  title: string
  category: CategorySlug
  year: string
  description: string
  /** External or internal link to the live thing, if public. Omit if there's nothing to link to. */
  link?: string
  linkLabel?: string
}

export const projects: Project[] = [
  {
    slug: 'mean-sd-calculator',
    title: 'Combined Mean & SD Calculator',
    category: 'vibecoded-tools',
    year: '2026',
    description:
      'Built for a friend crunching numbers for her PhD study — merges mean and standard deviation across groups instantly, with a clean UI so she could just plug in numbers and trust the result.',
    link: '/tools/mean-sd-calculator',
    linkLabel: 'Open tool',
  },
  {
    slug: 'docqr',
    title: 'DocQR',
    category: 'vibecoded-tools',
    year: '2026',
    description:
      'Turns any document into a scannable QR code, entirely client-side. Built so a friend could hand a document to people stopping by her stall at a conference — no printing, no mass emails.',
    link: '/tools/docqr',
    linkLabel: 'Open tool',
  },
  {
    slug: 'insulin-pump-finder',
    title: 'Insulin Pump Finder',
    category: 'vibecoded-tools',
    year: '2026',
    description:
      'A short quiz that recommends an insulin pump sold in India based on lifestyle, budget, and clinical needs. Built to help a friend decide which pump to get.',
    link: '/tools/insulin-pump-finder',
    linkLabel: 'Open tool',
  },
  {
    slug: 'whatsapp-chat-viewer',
    title: 'WhatsApp Chat Viewer',
    category: 'vibecoded-tools',
    year: '2026',
    description:
      'Renders an exported WhatsApp chat backup with search and inline attachments, handling files with 500k+ messages via virtual scrolling. Built after losing an old chat backup with a friend.',
    link: '/tools/whatsapp-chat-viewer',
    linkLabel: 'Open tool',
  },
  {
    slug: 'ai-chatbots-report-generators',
    title: 'AI Chatbots & Report Generators',
    category: 'ai-ml-projects',
    year: '2025',
    description:
      'Conversational and reporting tools built on the OpenAI and Anthropic APIs — turning unstructured input into structured, usable output via prompt design, context construction, and structured-output parsing.',
  },
  {
    slug: 'ai-dashboard-generator',
    title: 'AI Dashboard Generator',
    category: 'ai-ml-projects',
    year: '2025',
    description:
      'An AI-powered analytics system that auto-generates dashboards from data captured through a dynamic form builder — users configure custom graphs per metric while the system recommends visualizations based on recent search activity.',
  },
  {
    slug: 'valorant-match-predictor',
    title: 'Valorant Match Predictor',
    category: 'experiments',
    year: '2024',
    description:
      'A machine-learning model predicting match outcomes from recent tournament performance. Built a dataset from the vlr.gg API, defined the feature set, and owned the full pipeline from extraction to prediction.',
  },
  {
    slug: 'playlist-converter',
    title: 'Playlist Converter',
    category: 'experiments',
    year: '2024',
    description: "Two-way Spotify ↔ YouTube playlist sync, built on both platforms' OAuth APIs.",
  },
]

export function getProjectsByCategory(category: CategorySlug): Project[] {
  return projects.filter((p) => p.category === category)
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getCategory(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug)
}
