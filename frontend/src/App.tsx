import { useState, useEffect } from 'react'
import { SituationInput }   from './components/SituationInput'
import { CategorySelector } from './components/CategorySelector'
import { SeveritySelector } from './components/SeveritySelector'
import { ToneSelector }     from './components/ToneSelector'
import { ApologyResult }    from './components/ApologyResult'
import { RewriteControls }  from './components/RewriteControls'
import { generateApology }  from './services/api'
import { saveSession, loadSession, clearSession } from './utils/sessionStorage'
import type { ApologySession, Category, Severity, Tone, RewriteInstruction } from './types'
import './App.css'

const DEFAULT_SESSION: ApologySession = {
  situation: '',
  category:  'friends',
  severity:  3,
  tone:      'sincere'
}

export default function App() {
  const [session, setSession]           = useState<ApologySession>(DEFAULT_SESSION)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [rewriteCount, setRewriteCount] = useState(0)
  const [showRestorePrompt, setShowRestorePrompt] = useState(false)
  const [restoredSession, setRestoredSession]     = useState<ApologySession | null>(null)

  useEffect(() => {
    const saved = loadSession()
    if (saved) {
      setRestoredSession(saved)
      setShowRestorePrompt(true)
    }
  }, [])

  useEffect(() => {
    if (session.situation || session.generatedApology) {
      saveSession(session)
    }
  }, [session])

  function updateSession(partial: Partial<ApologySession>) {
    setSession((prev) => ({ ...prev, ...partial }))
  }

  function handleRestoreYes() {
    if (restoredSession) {
      setSession(restoredSession)
      setRewriteCount(0)
    }
    setShowRestorePrompt(false)
    setRestoredSession(null)
  }

  function handleRestoreNo() {
    clearSession()
    setShowRestorePrompt(false)
    setRestoredSession(null)
  }

  function handleNewApology() {
    clearSession()
    setSession(DEFAULT_SESSION)
    setRewriteCount(0)
    setError(null)
  }

  async function handleGenerateApology() {
    setLoading(true)
    setError(null)
    try {
      const result = await generateApology({
        situation: session.situation,
        category:  session.category,
        severity:  session.severity,
        tone:      session.tone
      })
      updateSession({ generatedApology: result.apology })
      setRewriteCount(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleRewrite(instruction: RewriteInstruction) {
    setLoading(true)
    setError(null)
    try {
      const result = await generateApology({
        situation:          session.situation,
        category:           session.category,
        severity:           session.severity,
        tone:               session.tone,
        rewriteInstruction: instruction,
        previousApology:    session.generatedApology
      })
      updateSession({ generatedApology: result.apology })
      setRewriteCount((c) => c + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = session.situation.trim().length > 0 && !loading

  return (
    <div className="app">
      {showRestorePrompt && (
        <div className="modal-overlay">
          <div className="modal">
            <img src="/goose-judge.png" alt="Goose" className="modal-goose" />
            <h2>Welcome back, serial apologizer!</h2>
            <p>You were working on an apology. Continue where you left off?</p>
            <div className="modal-actions">
              <button type="button" className="btn-primary" onClick={handleRestoreYes}>
                Continue
              </button>
              <button type="button" className="btn-ghost" onClick={handleRestoreNo}>
                Start new
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="app-header">
        <img src="/goose-judge.png" alt="Goose" className="goose-mascot" />
        <h1>Apologizer</h1>
        <p className="tagline">Because sometimes you really did mess up.</p>
      </header>

      <main className="app-main">
        <SituationInput
          value={session.situation}
          onChange={(situation) => updateSession({ situation })}
        />

        <CategorySelector
          value={session.category}
          onChange={(category: Category) => updateSession({ category })}
        />

        <SeveritySelector
          value={session.severity}
          onChange={(severity: Severity) => updateSession({ severity })}
        />

        <ToneSelector
          value={session.tone}
          onChange={(tone: Tone) => updateSession({ tone })}
        />

        <div className="generate-row">
          <button
            type="button"
            className="btn-primary btn-generate"
            onClick={handleGenerateApology}
            disabled={!canGenerate}
          >
            {loading ? 'Crafting something sincere…' : 'Help me say sorry'}
          </button>

          {session.generatedApology && (
            <button
              type="button"
              className="btn-ghost btn-new"
              onClick={handleNewApology}
            >
              New apology
            </button>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <ApologyResult
          apology={session.generatedApology ?? ''}
          loading={loading}
        />

        {session.generatedApology && !loading && (
          <RewriteControls
            onRewrite={handleRewrite}
            rewriteCount={rewriteCount}
            loading={loading}
          />
        )}
      </main>

      <footer className="app-footer">
        <img src="/goose-judge.png" alt="Goose" className="footer-goose" />
        <p>The goose judges no one. Mostly.</p>
      </footer>
    </div>
  )
}
