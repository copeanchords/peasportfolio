export interface Tool {
  slug: string
  rank: string
  icon: string
  title: string
  description: string
  origin: string
  gradient: string
  tilt: string
}

export const tools: Tool[] = [
  {
    slug: 'mean-sd-calculator',
    rank: '01 — Most nerdy',
    icon: '📊',
    title: 'Combined Mean & SD Calculator',
    description:
      'Merge stats from multiple groups into one combined mean and standard deviation, instantly.',
    origin: 'Built for a friend crunching numbers for her PhD study.',
    gradient: 'linear-gradient(135deg,#3B2A86,#7B2FF7 55%,#3B82F6)',
    tilt: '-1.2deg',
  },
  {
    slug: 'docqr',
    rank: '02 — Most shareable',
    icon: '📄',
    title: 'DocQR',
    description:
      'Turn any document into a scannable QR code — no server, no upload, all in the browser.',
    origin: 'Built so a friend could hand out a document at a conference stall.',
    gradient: 'linear-gradient(135deg,#FF6B35,#F72585 65%)',
    tilt: '1.4deg',
  },
  {
    slug: 'insulin-pump-finder',
    rank: '03 — Most useful',
    icon: '💉',
    title: 'Insulin Pump Finder',
    description:
      'Compare insulin pumps available in India and find the one that fits your needs.',
    origin: 'Built to help a friend decide which insulin pump to get.',
    gradient: 'linear-gradient(135deg,#0d3320,#1DB954 70%)',
    tilt: '-0.8deg',
  },
  {
    slug: 'whatsapp-chat-viewer',
    rank: '04 — Most nostalgic',
    icon: '💬',
    title: 'WhatsApp Chat Viewer',
    description:
      'Import an exported chat backup and explore it with filters, search, and media — all locally.',
    origin: 'Built after losing an old chat backup with a friend.',
    gradient: 'linear-gradient(135deg,#0d3d38,#00C9A7 70%)',
    tilt: '1deg',
  },
]
