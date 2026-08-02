// Vercel Edge Function — GET /api/spotify-stats
//
// Serves real listening data for the hero section using a pre-authorized
// refresh token (see scripts/get-spotify-refresh-token.mjs). Requires three
// env vars: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN.
// Missing/invalid credentials degrade to `{ available: false }` rather than
// throwing, so the frontend can fall back gracefully.

export const config = { runtime: 'edge' }

interface SpotifyArtist {
  name: string
  genres: string[]
}

interface StatsResponse {
  available: boolean
  topArtists: string[]
  topGenres: string[]
}

function unavailable(): Response {
  const body: StatsResponse = { available: false, topArtists: [], topGenres: [] }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string | null> {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.access_token ?? null
}

export default async function handler(): Promise<Response> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    return unavailable()
  }

  const accessToken = await getAccessToken(clientId, clientSecret, refreshToken)
  if (!accessToken) return unavailable()

  const topArtistsRes = await fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  if (!topArtistsRes.ok) return unavailable()

  const topArtistsData = await topArtistsRes.json()
  const artists: SpotifyArtist[] = topArtistsData.items ?? []

  const topArtists = artists.slice(0, 5).map((a) => a.name)

  const genreCounts = new Map<string, number>()
  for (const artist of artists) {
    for (const genre of artist.genres) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1)
    }
  }
  const topGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre)

  const body: StatsResponse = { available: true, topArtists, topGenres }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
