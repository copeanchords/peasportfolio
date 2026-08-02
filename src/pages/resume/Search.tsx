import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projects, getCategory } from '../../data/projects'
import { skillGroups } from '../../data/skills'

export default function Search() {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()

  const matchedProjects = useMemo(() => {
    if (!q) return []
    return projects.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    )
  }, [q])

  const matchedSkills = useMemo(() => {
    if (!q) return []
    const results: { group: string; item: string }[] = []
    for (const group of skillGroups) {
      for (const item of group.items) {
        if (item.toLowerCase().includes(q)) results.push({ group: group.label, item })
      }
    }
    return results
  }, [q])

  const hasResults = matchedProjects.length > 0 || matchedSkills.length > 0

  return (
    <div className="px-6 py-8 md:px-8">
      <div className="relative mb-8 max-w-xl">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="#121212"
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to look up?"
          className="w-full rounded-full bg-white py-3 pr-4 pl-11 text-sm font-medium text-[#121212] placeholder:text-[#727272] focus:outline-none"
        />
      </div>

      {!q && <p className="text-sm text-[#b3b3b3]">Search across projects, tools, and skills.</p>}

      {q && !hasResults && (
        <p className="text-sm text-[#b3b3b3]">
          No results for <span className="font-semibold text-white">"{query}"</span>.
        </p>
      )}

      {matchedProjects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-white">Projects</h2>
          <div className="space-y-1">
            {matchedProjects.map((p) => {
              const category = getCategory(p.category)
              return (
                <Link
                  key={p.slug}
                  to={`/project/${p.slug}`}
                  className="flex items-center gap-4 rounded px-4 py-2.5 transition-colors hover:bg-row-hover"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gradient-to-br from-green to-emerald-800 text-lg">
                    🎶
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-white">{p.title}</div>
                    <div className="truncate text-sm text-[#b3b3b3]">
                      {category?.title} · {p.year}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {matchedSkills.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-white">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map(({ group, item }) => (
              <span
                key={`${group}-${item}`}
                className="rounded-full bg-row px-4 py-1.5 text-sm text-white"
                title={group}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
