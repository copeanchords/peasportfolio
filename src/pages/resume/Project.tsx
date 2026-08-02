import { Link, Navigate, useParams } from 'react-router-dom'
import { getCategory, getProject, getProjectsByCategory } from '../../data/projects'

export default function Project() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProject(slug) : undefined

  if (!project) return <Navigate to="/" replace />

  const category = getCategory(project.category)
  const more = getProjectsByCategory(project.category).filter((p) => p.slug !== project.slug)

  return (
    <div>
      <section className="flex flex-col items-center gap-6 bg-gradient-to-b from-emerald-800/50 to-transparent px-6 pt-16 pb-8 text-center md:flex-row md:items-end md:px-8 md:text-left">
        <div className="flex h-[180px] w-[180px] shrink-0 items-center justify-center rounded bg-gradient-to-br from-green to-emerald-800 text-6xl shadow-2xl md:h-[232px] md:w-[232px]">
          🎶
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-white">Single</div>
          <h1 className="mt-1 font-spotify text-3xl font-black tracking-tight text-white sm:text-5xl md:text-7xl">
            {project.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-[#b3b3b3] md:justify-start">
            <span className="font-semibold text-white">Purvesh Bargat</span>
            <span>·</span>
            <span>{project.year}</span>
            {category && (
              <>
                <span>·</span>
                <Link to={`/playlists/${category.slug}`} className="hover:underline">
                  {category.title}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:px-8">
        {project.link && (
          <a
            href={project.link}
            target={project.link.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 text-sm font-bold text-black shadow-lg transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            {project.linkLabel ?? 'Open'}
          </a>
        )}
        <p className="max-w-2xl text-[15px] leading-relaxed text-[#d1d1d1]">{project.description}</p>
      </section>

      {more.length > 0 && category && (
        <section className="px-6 pb-16 md:px-8">
          <h2 className="mb-4 text-xl font-bold text-white">More from {category.title}</h2>
          <div className="space-y-1">
            {more.map((p) => (
              <Link
                key={p.slug}
                to={`/project/${p.slug}`}
                className="group flex items-center gap-4 rounded px-4 py-2.5 transition-colors hover:bg-row-hover"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gradient-to-br from-green to-emerald-800 text-lg">
                  🎶
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-white">{p.title}</div>
                  <div className="truncate text-sm text-[#b3b3b3]">{p.description}</div>
                </div>
                <div className="hidden shrink-0 text-sm text-[#b3b3b3] sm:block">{p.year}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
