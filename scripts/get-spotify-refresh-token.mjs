#!/usr/bin/env node
// One-time local script: run this yourself to authorize the site's Spotify
// integration and print a refresh token. The token never passes through
// anyone but you — copy it straight into .env.local (and Vercel's env vars).
//
// Usage:
//   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy npm run spotify:token
//
// Before running, add this exact Redirect URI in your Spotify app settings
// (developer.spotify.com/dashboard): http://127.0.0.1:8888/callback

import http from 'node:http'
import crypto from 'node:crypto'

const PORT = 8888
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`
const SCOPES = ['user-top-read', 'user-read-recently-played'].join(' ')

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error(
    '\nSet SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first, e.g.:\n' +
      '  SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy npm run spotify:token\n',
  )
  process.exit(1)
}

const state = crypto.randomBytes(8).toString('hex')
const authUrl = new URL('https://accounts.spotify.com/authorize')
authUrl.searchParams.set('client_id', clientId)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
authUrl.searchParams.set('scope', SCOPES)
authUrl.searchParams.set('state', state)

console.log('\nOpen this URL, log in with the Spotify account whose stats you want shown, and approve access:\n')
console.log(authUrl.toString())
console.log(`\nWaiting for the redirect on ${REDIRECT_URI} ...\n`)

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI)
  if (url.pathname !== '/callback') {
    res.writeHead(404)
    res.end()
    return
  }

  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')

  if (returnedState !== state || !code) {
    res.writeHead(400, { 'Content-Type': 'text/html' })
    res.end('<h2>State mismatch or missing code — try again.</h2>')
    server.close()
    return
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  })
  const data = await tokenRes.json()

  if (data.refresh_token) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<h2>Done — check your terminal.</h2>You can close this tab.')
    console.log('Your refresh token — put this in .env.local as SPOTIFY_REFRESH_TOKEN:\n')
    console.log(data.refresh_token)
    console.log('\nAlso add SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN to your Vercel project env vars.\n')
  } else {
    res.writeHead(400, { 'Content-Type': 'text/html' })
    res.end('<h2>Something went wrong — check your terminal.</h2>')
    console.error(data)
  }

  server.close()
})

server.listen(PORT)
