import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Lab from './pages/Lab'
import MeanSdCalculator from './pages/tools/MeanSdCalculator'
import DocQR from './pages/tools/DocQR'
import InsulinPumpFinder from './pages/tools/InsulinPumpFinder'
import WhatsAppChatViewer from './pages/tools/WhatsAppChatViewer'
import AppShell from './layouts/AppShell'
import ResumeHome from './pages/resume/Home'
import Playlist from './pages/resume/Playlist'
import Project from './pages/resume/Project'
import Search from './pages/resume/Search'
import Skills from './pages/resume/Skills'

beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia
  }
  if (!('ResizeObserver' in window)) {
    // @ts-expect-error jsdom has no ResizeObserver
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
  if (!('IntersectionObserver' in window)) {
    // @ts-expect-error jsdom has no IntersectionObserver
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
  }
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
})

afterEach(cleanup)

const standaloneCases: [string, React.ComponentType][] = [
  ['Lab', Lab],
  ['MeanSdCalculator', MeanSdCalculator],
  ['DocQR', DocQR],
  ['InsulinPumpFinder', InsulinPumpFinder],
  ['WhatsAppChatViewer', WhatsAppChatViewer],
]

describe('standalone page smoke tests', () => {
  for (const [name, Component] of standaloneCases) {
    it(`${name} mounts without throwing`, () => {
      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      )
      expect(document.body).toBeTruthy()
    })
  }

  it('Lab links point at each tool route', () => {
    render(
      <MemoryRouter>
        <Lab />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('link', { name: /combined mean & sd calculator/i }).getAttribute('href'),
    ).toBe('/tools/mean-sd-calculator')
    expect(screen.getByRole('link', { name: /docqr/i }).getAttribute('href')).toBe('/tools/docqr')
    expect(
      screen.getByRole('link', { name: /insulin pump finder/i }).getAttribute('href'),
    ).toBe('/tools/insulin-pump-finder')
    expect(
      screen.getByRole('link', { name: /whatsapp chat viewer/i }).getAttribute('href'),
    ).toBe('/tools/whatsapp-chat-viewer')
  })
})

function renderAtPath(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<ResumeHome />} />
          <Route path="/playlists/:category" element={<Playlist />} />
          <Route path="/project/:slug" element={<Project />} />
          <Route path="/search" element={<Search />} />
          <Route path="/skills" element={<Skills />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('resume site smoke tests', () => {
  it('Home renders the name and experience section', () => {
    renderAtPath('/')
    expect(screen.getAllByText(/purvesh bargat/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Experience')).toBeTruthy()
    expect(screen.getByText('Founding Product Manager')).toBeTruthy()
  })

  it('Playlist renders projects for a valid category', () => {
    renderAtPath('/playlists/vibecoded-tools')
    expect(screen.getByText('Combined Mean & SD Calculator')).toBeTruthy()
    expect(screen.getByText('DocQR')).toBeTruthy()
  })

  it('Playlist redirects home for an unknown category', () => {
    renderAtPath('/playlists/does-not-exist')
    expect(screen.getByText('Experience')).toBeTruthy()
  })

  it('Project renders a valid project detail page', () => {
    renderAtPath('/project/docqr')
    expect(screen.getAllByText('DocQR').length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /open tool/i }).getAttribute('href')).toBe(
      '/tools/docqr',
    )
  })

  it('Project redirects home for an unknown slug', () => {
    renderAtPath('/project/does-not-exist')
    expect(screen.getByText('Experience')).toBeTruthy()
  })

  it('Search filters projects by query', () => {
    renderAtPath('/search')
    const input = screen.getByPlaceholderText(/what do you want to look up/i)
    fireEvent.change(input, { target: { value: 'docqr' } })
    expect(screen.getByText('DocQR')).toBeTruthy()
  })

  it('Skills page lists every skill group', () => {
    renderAtPath('/skills')
    expect(screen.getByText('Product')).toBeTruthy()
    expect(screen.getByText('AI & LLM')).toBeTruthy()
    expect(screen.getAllByText('Figma').length).toBeGreaterThan(0)
  })

  it('sidebar exposes a persistent Skills nav link', () => {
    renderAtPath('/')
    expect(screen.getAllByRole('link', { name: /skills/i })[0].getAttribute('href')).toBe('/skills')
  })
})
