import { Link, Navigate, useParams } from 'react-router-dom'
import { getCategory, getProjectsByCategory } from '../../data/projects'

export default function Playlist() {
  const { category } = useParams<{ category: string }>()
  const meta = category ? getCategory(category) : undefined

  if (!meta) return <Navigate to="/" replace />

  const items = getProjectsByCategory(meta.slug)

  return (
    <div>
      <section className="flex items-end gap-6 bg-gradient-to-b from-purple-800/50 to-transparent px-6 pt-16 pb-8 md:px-8">
        <div className="flex h-[160px] w-[160px] shrink-0 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-blue-500 text-5xl shadow-2xl md:h-[232px] md:w-[232px]">
          🎵
        </div>
        <div>
          <div className="text-xs font-bold text-white">Playlist</div>
          <h1 className="mt-1 font-spotify text-3xl font-black tracking-tight text-white sm:text-5xl md:text-7xl">
            {meta.title}
          </h1>
          <p className="mt-3 text-sm text-[#b3b3b3]">{meta.description}</p>
          <div className="mt-2 text-sm text-[#b3b3b3]">
            Purvesh Bargat · {items.length} {items.length === 1 ? 'track' : 'tracks'}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-8">
        <div className="space-y-1">
          {items.map((p, i) => (
            <Link
              key={p.slug}
              to={`/project/${p.slug}`}
              className="group flex items-center gap-4 rounded px-4 py-2.5 transition-colors hover:bg-row-hover"
            >
              <span className="w-5 shrink-0 text-right text-sm text-[#b3b3b3] group-hover:hidden">{i + 1}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff" className="hidden w-5 shrink-0 group-hover:block">
                <path d="M8 5v14l11-7z" />
              </svg>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-white">{p.title}</div>
                <div className="truncate text-sm text-[#b3b3b3]">{p.description}</div>
              </div>
              <div className="hidden shrink-0 text-sm text-[#b3b3b3] sm:block">{p.year}</div>
            </Link>
          ))}
          {items.length === 0 && <p className="px-4 text-sm text-[#b3b3b3]">Nothing here yet.</p>}
        </div>
      </section>
    </div>
  )
}
