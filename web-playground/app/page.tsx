'use client';

import { useState } from 'react';
import QualityRadar from './components/QualityRadar';

const domains = [
  'software',
  'brands',
  'products',
  'content',
  'business',
  'systems',
  'creative',
  'research',
  'events',
  'education'
];

export default function HomePage() {
  const [concept, setConcept] = useState('');
  const [domain, setDomain] = useState(domains[0]);
  const [constraints, setConstraints] = useState('');
  const [aestheticDirection, setAestheticDirection] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        concept,
        domain,
        constraints: constraints.split(',').map((item) => item.trim()).filter(Boolean),
        aestheticDirection
      })
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="page">
      <section className="container">
        <header className="header">
          <h1 className="title text-gradient">Neon Genie Playground</h1>
          <p className="subtitle">
            Generate ideation artifacts, inspect quality scores, and export outputs.
          </p>
        </header>

        <div className="card grid">
          <div className="field">
            <label className="label">Concept</label>
            <input
              className="input"
              value={concept}
              onChange={(event) => setConcept(event.target.value)}
              placeholder="Describe the idea you want to explore"
            />
          </div>

          <div className="field">
            <label className="label">Domain</label>
            <select
              className="input"
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
            >
              {domains.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Constraints</label>
            <input
              className="input"
              value={constraints}
              onChange={(event) => setConstraints(event.target.value)}
              placeholder="e.g. realtime, offline, privacy focused"
            />
          </div>

          <div className="field">
            <label className="label">Aesthetic Direction</label>
            <input
              className="input"
              value={aestheticDirection}
              onChange={(event) => setAestheticDirection(event.target.value)}
              placeholder="Optional art direction"
            />
          </div>

          <button className="button" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {result && (
          <section className="card result">
            <div className="stack">
              <h2 className="result-title">{result.title}</h2>
              <p className="subtitle">{result.solution}</p>
            </div>

            <QualityRadar score={result.quality} />

            <div className="stack">
              <h3 className="section-title">Components</h3>
              <ul className="list">
                {result.components.map((component: any) => (
                  <li key={component.name} className="list-item">
                    <strong className="accent">{component.name}</strong>
                    <p className="subtitle">{component.function}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="actions">
              <button
                className="button ghost"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
              >
                Copy JSON
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
