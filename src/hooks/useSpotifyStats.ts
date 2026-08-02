import { useEffect, useState } from 'react'

export interface SpotifyStats {
  available: boolean
  topArtists: string[]
  topGenres: string[]
}

const FALLBACK: SpotifyStats = { available: false, topArtists: [], topGenres: [] }

/**
 * Fetches real listening stats from /api/spotify-stats. Only resolves against
 * a live Vercel deployment or `vercel dev` — plain `vite dev` has no /api
 * routes, so this quietly falls back to `available: false` in local dev.
 */
export function useSpotifyStats() {
  const [stats, setStats] = useState<SpotifyStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('/api/spotify-stats')
      .then((res) => (res.ok ? res.json() : FALLBACK))
      .then((data: SpotifyStats) => {
        if (!cancelled) setStats(data)
      })
      .catch(() => {
        if (!cancelled) setStats(FALLBACK)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { stats: stats ?? FALLBACK, loading }
}
