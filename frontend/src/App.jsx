import { useState } from 'react';
import HierarchyCard from './components/HierarchyCard';
import SummaryPanel from './components/SummaryPanel';
import ThemeToggle from './components/ThemeToggle';
import './index.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const EXAMPLE = `A->B, A->C, B->D, C->E, E->F,
X->Y, Y->Z, Z->X,
P->Q, Q->R,
G->H, G->H, G->I,
hello, 1->2, A->`;

export default function App() {
  const [input, setInput]     = useState(EXAMPLE);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [result, setResult]   = useState(null);

  function parseInput(raw) {
    return raw
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = parseInput(input);
      const res = await fetch(`${API_BASE}/bfhl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Server returned ${res.status}`);
      }

      setResult(json);
    } catch (err) {
      setError(err.message || 'Network error — is the API running?');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setInput('');
    setResult(null);
    setError(null);
  }

  function handleLoadExample() {
    setInput(EXAMPLE);
    setResult(null);
    setError(null);
  }

  return (
    <div className="app-wrapper">

      <ThemeToggle />

      <div className="identity-chip">
        <div className="identity-avatar">O</div>
        <div className="identity-info">
          <span className="identity-name">Ojas Sharma</span>
          <span className="identity-meta">2310991400 · ojas1400.be23@chitkara.edu.in</span>
        </div>
      </div>

      <div className="container">

        <header className="header">
          <div className="header-badge">
            <span className="dot" />
            Chitkara Full Stack Challenge
          </div>
          <h1>BFHL Hierarchy Analyser</h1>
          <p>Enter node edges below and instantly visualise the hierarchical tree structure</p>
        </header>

        <div className="card input-section">
          <form onSubmit={handleSubmit}>
            <label className="input-label" htmlFor="node-input">
              Node Edges
            </label>
            <p className="input-hint">
              Format: A-&gt;B&nbsp; · Separate entries with commas or newlines
            </p>
            <div className="textarea-wrapper">
              <textarea
                id="node-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="e.g.  A->B, A->C, B->D"
                spellCheck={false}
              />
            </div>

            <div className="btn-row">
              <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
                {loading ? <span className="spinner" /> : '▶'}
                {loading ? 'Processing…' : 'Analyse'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleLoadExample}>
                Load Example
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleClear}>
                Clear
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span className="err-icon">⚠</span>
            <div>
              <strong>API Error</strong><br />
              {error}
            </div>
          </div>
        )}

        {result && (
          <div className="results-grid">

            <SummaryPanel
              summary={result.summary}
              user_id={result.user_id}
              email_id={result.email_id}
              college_roll_number={result.college_roll_number}
            />

            <div className="card">
              <div className="card-title">
                <span className="icon">🌲</span>
                Hierarchies&nbsp;
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                  ({result.hierarchies.length})
                </span>
              </div>
              {result.hierarchies.length === 0 ? (
                <p className="empty-state">No hierarchies found.</p>
              ) : (
                <div className="hierarchy-list">
                  {result.hierarchies.map((h, i) => (
                    <HierarchyCard key={`${h.root}-${i}`} hierarchy={h} />
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              <div className="card">
                <div className="card-title">
                  <span className="icon">❌</span>
                  Invalid Entries
                  <span style={{ marginLeft: 'auto', color: 'var(--red)', fontWeight: 700 }}>
                    {result.invalid_entries.length}
                  </span>
                </div>
                {result.invalid_entries.length === 0 ? (
                  <p className="empty-state">None — all entries are valid!</p>
                ) : (
                  <div className="tag-list">
                    {result.invalid_entries.map((e, i) => (
                      <span key={i} className="entry-tag invalid">
                        {e === '' ? '(empty)' : e}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <div className="card-title">
                  <span className="icon">🔁</span>
                  Duplicate Edges
                  <span style={{ marginLeft: 'auto', color: 'var(--amber)', fontWeight: 700 }}>
                    {result.duplicate_edges.length}
                  </span>
                </div>
                {result.duplicate_edges.length === 0 ? (
                  <p className="empty-state">No duplicates found!</p>
                ) : (
                  <div className="tag-list">
                    {result.duplicate_edges.map((e, i) => (
                      <span key={i} className="entry-tag duplicate">{e}</span>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        <footer className="footer">
          BFHL API · Chitkara University · Full Stack Engineering Challenge
        </footer>

      </div>
    </div>
  );
}
