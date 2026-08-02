export interface ExperienceEntry {
  slug: string
  title: string
  company: string
  location: string
  dates: string
  blurb?: string
  achievements: string[]
}

export const experience: ExperienceEntry[] = [
  {
    slug: 'founding-pm-csr-platform',
    title: 'Founding Product Manager',
    company: 'Early-Stage B2B SaaS Startup (CSR Management Platform)',
    location: 'Noida',
    dates: 'Jun 2025 - Present',
    blurb:
      'Live enterprise platform for CSR program management, budgeting, and funds-utilization tracking, serving enterprise clients.',
    achievements: [
      'Partnered with engineers and the founding team to deliver features from concept to production, translating client requirements into build-ready specifications without a separate PM hand-off, which accelerated delivery speed',
      'Conducted discovery interviews with enterprise clients in finance, operations, and management, then wrote structured product requirements and user stories with acceptance criteria and edge cases that engineers could build from directly, improving requirement clarity',
      "Competitive & market research: benchmarked competing CSR management platforms to evaluate their feature sets and workflows, using those findings to shape product decisions and position our tool's functionality against the market",
      'Metrics-driven prioritization: tracked feature adoption and usage analytics post-launch to prioritize the next sprint and surface drop-off points, work that cut client onboarding from 3 meetings to 1',
      'Owned and prioritized the product backlog in Jira across multiple workstreams, weighing client impact against engineering bandwidth, and kept the roadmap up-to-date as priorities shifted, ensuring alignment with business goals',
      'Launch & release coordination: coordinated UAT cycles and sign-off with enterprise clients before every production release, reducing critical post-deployment bugs by ~80% (from ~10 to ~2 per release)',
      'Self-serve analytics: designed and shipped a self-serve analytics module letting admins build dynamic charts, multi-option visualizations, and pivot tables, turning a recurring client request into a self-serve capability and removing developer dependency entirely',
      'Access control: designed and implemented Role-Based Access Control (RBAC), translating client permission requirements directly into technical specs',
      "Client MVP delivery: independently scoped, built, and shipped a data-reporting MVP for a strategic CSR client using rapid, AI-assisted development — integrating multiple REST APIs, automating data analysis, and delivering a live Python/React dashboard deployed on Vercel; the tool is now used in production as the client's primary reporting solution",
      'Ran daily stand-ups, sprint ceremonies, and status updates for clients and internal teams, keeping all stakeholders aligned on progress, risks, and upcoming milestones',
      "Data model decision: re-architected the MongoDB schema from monolithic documents into a normalized structure, cutting query latency from ~20s to ~5s, a change spec'd and driven through to implementation",
    ],
  },
  {
    slug: 'python-developer-intern-hsm-edifice',
    title: 'Python Developer Intern',
    company: 'HSM Edifice',
    location: 'Nagpur',
    dates: 'Jun 2024 - Dec 2024',
    achievements: [
      'Built and maintained core Python application features using MongoDB and Google Workspace APIs, collaborating with a senior developer to improve system stability and reduce bugs',
      'Proposed product features in management brainstorms; several were shipped into the live product',
    ],
  },
]
