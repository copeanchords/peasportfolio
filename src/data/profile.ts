export interface ContactChip {
  label: string
  href: string
}

export const profile = {
  name: 'Purvesh Bargat',
  tagline: 'Product Manager · AI-Powered Products · 0→1 Delivery · Music Curator',
  location: 'Noida, India',
  bio: 'Founding Product Manager driving end-to-end delivery of an enterprise B2B SaaS CSR platform. Senior product leader experienced in rapid feature rollout, user-driven spec creation, and adoption metric tracking. Built AI-enhanced capabilities using OpenAI and Anthropic APIs, delivering prompt-engineered, RAG-style pipelines.',
  avatarUrl: '/images/profile.jpg' as string | null,
  coverImageUrl: '/images/cover.jpeg' as string | null,
  aboutImageUrl: '/images/about.jpg' as string | null,
  // TODO(purvesh): resume was for content only — add the real Drive link here when ready.
  // The Download button only renders once this is non-null.
  resumeUrl: "https://drive.google.com/file/d/1L-OZz0sQiC550FHDQial2RIrTEEpGSp5/view?usp=sharing",
  // TODO(purvesh): confirm how you want the About stat callout framed (e.g. "2+ Years Experience",
  // "Shipping since 2024") — left unset so the callout stays hidden rather than guess at a number.
  statCallout: "1+ Years Experience",
  contacts: [
    { label: 'Email', href: 'mailto:bargatpurvesh@gmail.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/bargatpurvesh' },
    {
      label: 'Spotify',
      href: 'https://open.spotify.com/user/3147v24uchzerqy4htw5diink6pi?si=2c13ac386bd748da',
    },
  ] satisfies ContactChip[],
}
