import { skillGroups } from '../../data/skills'

export default function Skills() {
  return (
    <div>
      <section className="flex items-end gap-6 bg-gradient-to-b from-green/30 to-transparent px-6 pt-16 pb-8 md:px-8">
        <div className="flex h-[160px] w-[160px] shrink-0 items-center justify-center rounded bg-gradient-to-br from-green to-emerald-800 text-5xl shadow-2xl md:h-[232px] md:w-[232px]">
          ⭐
        </div>
        <div>
          <div className="text-xs font-bold text-white">Genres</div>
          <h1 className="mt-1 font-spotify text-3xl font-black tracking-tight text-white sm:text-5xl md:text-7xl">
            Skills
          </h1>
          <p className="mt-3 text-sm text-[#b3b3b3]">Purvesh Bargat · what shows up on every release</p>
        </div>
      </section>

      <section className="space-y-10 px-6 pb-16 md:px-8">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h2 className="mb-4 text-xl font-bold text-white">{group.label}</h2>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-green/40 bg-green/15 px-4 py-1.5 text-sm font-medium text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
