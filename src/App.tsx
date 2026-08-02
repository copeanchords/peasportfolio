import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './layouts/AppShell'

const ResumeHome = lazy(() => import('./pages/resume/Home'))
const Playlist = lazy(() => import('./pages/resume/Playlist'))
const Project = lazy(() => import('./pages/resume/Project'))
const Search = lazy(() => import('./pages/resume/Search'))
const Skills = lazy(() => import('./pages/resume/Skills'))

const Lab = lazy(() => import('./pages/Lab'))
const MeanSdCalculator = lazy(() => import('./pages/tools/MeanSdCalculator'))
const DocQR = lazy(() => import('./pages/tools/DocQR'))
const InsulinPumpFinder = lazy(() => import('./pages/tools/InsulinPumpFinder'))
const WhatsAppChatViewer = lazy(() => import('./pages/tools/WhatsAppChatViewer'))

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-ink-dim">
      Loading…
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<ResumeHome />} />
          <Route path="/playlists/:category" element={<Playlist />} />
          <Route path="/project/:slug" element={<Project />} />
          <Route path="/search" element={<Search />} />
          <Route path="/skills" element={<Skills />} />
        </Route>

        <Route path="/lab" element={<Lab />} />
        <Route path="/tools/mean-sd-calculator" element={<MeanSdCalculator />} />
        <Route path="/tools/docqr" element={<DocQR />} />
        <Route path="/tools/insulin-pump-finder" element={<InsulinPumpFinder />} />
        <Route path="/tools/whatsapp-chat-viewer" element={<WhatsAppChatViewer />} />
      </Routes>
    </Suspense>
  )
}

export default App
