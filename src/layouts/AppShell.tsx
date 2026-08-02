import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { categories } from '../data/projects'
import { profile } from '../data/profile'
import { skillGroups } from '../data/skills'

const toolsGroup = skillGroups.find((g) => g.label === 'Tools')

function TopBar() {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Go forward"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {profile.resumeUrl && (
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          Download Résumé
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
    </div>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? '#fff' : '#b3b3b3'}>
      <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20a1 1 0 001 1h4a1 1 0 001-1v-5a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 001 1h4a1 1 0 001-1V7.577l-7.5-4.33z" />
    </svg>
  )
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={active ? '#fff' : '#b3b3b3'} strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  )
}

function SkillsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={active ? '#fff' : '#b3b3b3'} strokeWidth={2}>
      <path
        d="M12 2l2.9 6.26L21 9.27l-4.5 4.39L17.8 21 12 17.77 6.2 21l1.3-7.34L3 9.27l6.1-1.01z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#b3b3b3">
      <path d="M4 3a1 1 0 00-1 1v16a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1H4zm6.5 0a1 1 0 00-1 1v16a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2zm7.13 1.6a1 1 0 00-1.24.68L13.1 20.1a1 1 0 00.68 1.24l1.93.53a1 1 0 001.24-.68l3.29-14.82a1 1 0 00-.68-1.24l-1.93-.53z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="#000">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function BrandLogo() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="12" fill="#1db954" />
      <path d="M6.2 9.3c3.8-1.1 9.2-.8 12.4 1.1" fill="none" stroke="#000" strokeWidth={1.7} strokeLinecap="round" />
      <path d="M6.7 12.6c3.2-.9 8-.7 10.9 1" fill="none" stroke="#000" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M7.3 15.7c2.7-.7 6.6-.6 9 .8" fill="none" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  )
}

function playlistIcon(index: number) {
  const gradients = [
    'from-purple-500 to-blue-500',
    'from-orange-500 to-pink-500',
    'from-emerald-600 to-green-400',
  ]
  return gradients[index % gradients.length]
}

function Sidebar() {
  return (
    <aside className="hidden w-[280px] shrink-0 flex-col gap-2 md:flex">
      <nav className="rounded-lg bg-black px-2 py-4">
        <NavLink to="/" end className="mb-4 flex items-center gap-2 px-3 text-white no-underline">
          <BrandLogo />
          <span className="font-spotify text-lg font-black">purvesh</span>
        </NavLink>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-4 rounded px-3 py-2.5 text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`
          }
        >
          {({ isActive }) => (
            <>
              <HomeIcon active={isActive} /> Home
            </>
          )}
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-4 rounded px-3 py-2.5 text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`
          }
        >
          {({ isActive }) => (
            <>
              <SearchIcon active={isActive} /> Search
            </>
          )}
        </NavLink>
        <NavLink
          to="/skills"
          className={({ isActive }) =>
            `flex items-center gap-4 rounded px-3 py-2.5 text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`
          }
        >
          {({ isActive }) => (
            <>
              <SkillsIcon active={isActive} /> Skills
            </>
          )}
        </NavLink>
      </nav>

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-black">
        <div className="flex items-center gap-3 px-5 py-4 text-[#b3b3b3]">
          <LibraryIcon />
          <span className="text-sm font-bold text-white">Your Library</span>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <NavLink
            to="/lab"
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2 text-sm transition-colors ${isActive ? 'bg-row-hover text-white' : 'text-[#b3b3b3] hover:text-white'}`
            }
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gradient-to-br from-green to-emerald-800 text-lg">
              🧪
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">The Lab</span>
              <span className="block truncate text-xs text-[#b3b3b3]">Playlist · Vibecoded tools</span>
            </span>
          </NavLink>

          {categories.map((cat, i) => (
            <NavLink
              key={cat.slug}
              to={`/playlists/${cat.slug}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 text-sm transition-colors ${isActive ? 'bg-row-hover text-white' : 'text-[#b3b3b3] hover:text-white'}`
              }
            >
              <span
                className={`h-10 w-10 shrink-0 rounded bg-gradient-to-br ${playlistIcon(i)}`}
              />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{cat.title}</span>
                <span className="block truncate text-xs text-[#b3b3b3]">Playlist · Purvesh Bargat</span>
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      {toolsGroup && (
        <div className="rounded-lg bg-black px-5 py-4">
          <div className="mb-3 text-xs font-bold tracking-wide text-[#b3b3b3] uppercase">Tools</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-[#e0e0e0]">
            {toolsGroup.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-black px-5 py-4">
        <div className="mb-3 text-xs font-bold tracking-wide text-[#b3b3b3] uppercase">Contact</div>
        <div className="flex flex-col gap-1.5">
          {profile.contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-sm text-[#e0e0e0] hover:text-white hover:underline"
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#b3b3b3" strokeWidth={2} className="shrink-0">
      <path
        d="M12 21s-6.7-4.35-9.3-8.28C.86 9.94 1.7 6.6 4.6 5.6 6.9 4.8 9 5.9 12 8.6c3-2.7 5.1-3.8 7.4-3 2.9 1 3.74 4.34 1.9 7.12C18.7 16.65 12 21 12 21z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TransportIcon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#b3b3b3" strokeWidth={2}>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NowPlayingBar() {
  return (
    <div className="hidden h-[90px] shrink-0 items-center justify-between border-t border-[#282828] bg-black px-4 md:flex">
      <div className="flex w-[30%] min-w-0 items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-gradient-to-br from-green to-emerald-800 text-xl">
          🎧
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{profile.name}</div>
          <div className="truncate text-xs text-[#b3b3b3]">{profile.tagline}</div>
        </div>
        <HeartIcon />
      </div>

      <div className="flex w-[40%] max-w-[560px] flex-col items-center gap-2">
        <div className="flex items-center gap-5">
          <TransportIcon path="M17 17H3l4-4M7 7h14l-4 4" />
          <TransportIcon path="M19 6l-9 6 9 6V6zM5 6v12" />
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <PlayIcon />
          </span>
          <TransportIcon path="M5 6l9 6-9 6V6zM19 6v12" />
          <TransportIcon path="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3" />
        </div>
        <div className="flex w-full items-center gap-2 text-[11px] text-[#b3b3b3]">
          <span>2:26</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#4d4d4d]">
            <div className="h-full w-[62%] rounded-full bg-white" />
          </div>
          <span>3:47</span>
        </div>
      </div>

      <div className="flex w-[30%] justify-end">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-[#4d4d4d]">
          <div className="h-full w-2/3 rounded-full bg-white" />
        </div>
      </div>
    </div>
  )
}

function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex h-16 items-center justify-around border-t border-[#282828] bg-black md:hidden">
      <NavLink to="/" end className="flex flex-col items-center gap-1 text-[11px]">
        {({ isActive }) => (
          <>
            <HomeIcon active={isActive} />
            <span className={isActive ? 'text-white' : 'text-[#b3b3b3]'}>Home</span>
          </>
        )}
      </NavLink>
      <NavLink to="/search" className="flex flex-col items-center gap-1 text-[11px]">
        {({ isActive }) => (
          <>
            <SearchIcon active={isActive} />
            <span className={isActive ? 'text-white' : 'text-[#b3b3b3]'}>Search</span>
          </>
        )}
      </NavLink>
      <NavLink to="/skills" className="flex flex-col items-center gap-1 text-[11px]">
        {({ isActive }) => (
          <>
            <SkillsIcon active={isActive} />
            <span className={isActive ? 'text-white' : 'text-[#b3b3b3]'}>Skills</span>
          </>
        )}
      </NavLink>
      <NavLink to="/lab" className="flex flex-col items-center gap-1 text-[11px]">
        {({ isActive }) => (
          <>
            <span className="text-lg leading-none">🧪</span>
            <span className={isActive ? 'text-white' : 'text-[#b3b3b3]'}>Lab</span>
          </>
        )}
      </NavLink>
    </nav>
  )
}

export default function AppShell() {
  return (
    <div className="flex h-screen flex-col gap-2 bg-black p-2 font-spotify text-white">
      <div className="flex flex-1 gap-2 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto rounded-lg bg-bg-soft pb-20 md:pb-0">
          <TopBar />
          <Outlet />
        </main>
      </div>
      <NowPlayingBar />
      <MobileTabBar />
    </div>
  )
}
