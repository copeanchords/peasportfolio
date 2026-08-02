import { motion } from 'framer-motion'
import { profile } from '../../data/profile'
import { education } from '../../data/education'
import { experience } from '../../data/experience'
import { projects } from '../../data/projects'
import { useSpotifyStats } from '../../hooks/useSpotifyStats'

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#3d91f4" className="shrink-0">
      <path d="M12 2l2.2 1.3 2.5-.4 1.3 2.2 2.2 1.3-.4 2.5 1.3 2.2-1.3 2.2.4 2.5-2.2 1.3-1.3 2.2-2.5-.4L12 22l-2.2-1.3-2.5.4-1.3-2.2-2.2-1.3.4-2.5L3 12l1.3-2.2-.4-2.5 2.2-1.3 1.3-2.2 2.5.4L12 2z" />
      <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#b3b3b3" strokeWidth={2} className="mt-0.5 shrink-0">
      <path
        d="M12 21s-6.7-4.35-9.3-8.28C.86 9.94 1.7 6.6 4.6 5.6 6.9 4.8 9 5.9 12 8.6c3-2.7 5.1-3.8 7.4-3 2.9 1 3.74 4.34 1.9 7.12C18.7 16.65 12 21 12 21z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlayIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#000">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function HeroArt() {
  if (profile.coverImageUrl) {
    return (
      <div className="absolute inset-0 -z-10">
        <img src={profile.coverImageUrl} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-soft via-black/30 to-black/10" />
      </div>
    )
  }
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        background:
          'radial-gradient(ellipse 70% 60% at 30% 20%, rgba(29,185,84,0.35), transparent 60%),' +
          'radial-gradient(ellipse 60% 50% at 80% 0%, rgba(61,145,244,0.3), transparent 55%),' +
          'radial-gradient(ellipse 70% 70% at 100% 60%, rgba(123,47,247,0.25), transparent 60%),' +
          '#0d0d0d',
      }}
    />
  )
}

function StatsRow() {
  const { stats, loading } = useSpotifyStats()

  if (loading) return null

  if (stats.available && stats.topGenres.length > 0) {
    return (
      <div className="mt-1 text-sm font-semibold text-[#e0e0e0]">
        Top genres: <span className="text-white">{stats.topGenres.slice(0, 3).join(', ')}</span>
      </div>
    )
  }

  const years = experience
    .flatMap((e) => [...e.dates.matchAll(/\d{4}/g)].map((m) => Number(m[0])))
    .filter((y) => !Number.isNaN(y))
  const earliestYear = years.length > 0 ? Math.min(...years) : undefined

  return (
    <div className="mt-1 text-sm font-semibold text-[#e0e0e0]">
      {projects.length} releases{earliestYear ? ` · shipping product since ${earliestYear}` : ''}
    </div>
  )
}

function ExperienceCard({ entry }: { entry: (typeof experience)[number] }) {
  return (
    <div className="rounded-lg bg-row p-6">
      <h3 className="text-lg font-bold text-white">{entry.title}</h3>
      <div className="mt-0.5 text-sm text-[#b3b3b3]">{entry.company}</div>
      <div className="mt-0.5 text-xs text-[#b3b3b3]">{entry.dates}</div>
      {entry.blurb && <p className="mt-3 text-sm text-[#b3b3b3] italic">{entry.blurb}</p>}
      <ul className="mt-4 space-y-2.5">
        {entry.achievements.map((a, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-[#d1d1d1]">
            <HeartIcon />
            <span>{a}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ContactCard() {
  return (
    <div className="rounded-lg bg-row p-6">
      <div className="mb-4 flex items-center gap-3">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green to-emerald-800 text-lg font-bold text-white">
            {initials(profile.name)}
          </div>
        )}
        <div className="rounded-full rounded-bl-none bg-white px-3 py-1.5 text-xs font-semibold text-black">
          Get in touch!
        </div>
      </div>
      <h3 className="text-lg font-bold text-white">Contact Information</h3>
      <div className="mb-4 text-xs text-[#b3b3b3]">Playlist</div>
      <div className="grid grid-cols-1 gap-2">
        {profile.contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="rounded-full border border-[#5a5a5a] px-4 py-2 text-center text-xs font-bold tracking-wide text-white uppercase transition-colors hover:border-white"
          >
            {c.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden px-6 pt-20 pb-8 md:px-8 md:pt-28">
        <HeroArt />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#3d91f4]/15 px-3 py-1 text-xs font-bold text-[#3d91f4]">
            <VerifiedBadge /> Verified
          </div>
          <h1 className="mt-3 font-spotify text-5xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
            {profile.name}
          </h1>
          <StatsRow />
        </motion.div>
      </section>

      {/* Actions */}
      <section className="flex flex-wrap items-center gap-5 px-6 py-6 md:px-8">
        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green shadow-lg transition-transform hover:scale-105"
          title={profile.tagline}
        >
          <PlayIcon />
        </button>
        <button
          type="button"
          className="rounded-full border border-[#5a5a5a] px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:border-white"
        >
          Following
        </button>
        <button type="button" aria-label="More options" className="text-[#b3b3b3] hover:text-white">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </section>

      {/* About + Education */}
      <section className="grid grid-cols-1 gap-6 px-6 py-8 md:px-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold text-white">About</h2>
          <div
            className={`relative isolate overflow-hidden rounded-lg ${profile.aboutImageUrl ? 'min-h-[320px]' : 'bg-row p-6'}`}
          >
            {profile.aboutImageUrl && (
              <>
                <img src={profile.aboutImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
              </>
            )}
            {profile.statCallout && (
              <div className="absolute top-4 right-4 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#3d91f4] text-center text-[10px] leading-tight font-bold text-white shadow-lg">
                {profile.statCallout}
              </div>
            )}
            <p
              className={`max-w-2xl text-[15px] leading-relaxed text-[#d1d1d1] ${profile.aboutImageUrl ? 'relative p-6 pt-40' : ''}`}
            >
              {profile.bio}
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">Education</h2>
          <div className="space-y-3">
            {education.map((e) => {
              const years = [...e.dates.matchAll(/\d{4}/g)].map((m) => m[0].slice(2))
              return (
                <div key={e.school} className="flex items-start gap-4 rounded-lg bg-row p-4">
                  <div className="flex shrink-0 flex-col items-center justify-center rounded-md bg-black px-2.5 py-1.5 text-center leading-tight">
                    <span className="text-[10px] font-bold text-[#b3b3b3] uppercase">{years[0] ?? ''}</span>
                    <span className="text-sm font-bold text-white">{years[1] ?? ''}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{e.school}</div>
                    <div className="text-xs text-[#b3b3b3]">{e.degree}</div>
                    <div className="text-xs text-[#b3b3b3]">
                      {e.location} · {e.dates}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="grid grid-cols-1 gap-6 px-6 py-8 pb-16 md:px-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold text-white">Experience</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {experience.map((entry) => (
              <ExperienceCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">Artist Pick</h2>
          <ContactCard />
        </div>
      </section>
    </div>
  )
}
