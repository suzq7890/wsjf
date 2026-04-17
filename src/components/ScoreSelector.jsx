import { useState } from 'react'

export function ScoreSelector({ dimension, label, value, onChange }) {
  const [hovered, setHovered] = useState(null)

  const activeScore = hovered ?? value
  const activeDef = activeScore != null
    ? dimension.scaleDefinitions.find(d => d.score === activeScore)
    : null

  return (
    <div className="score-selector">
      <div className="selector-header">
        <span className="selector-label">{label || dimension.name}</span>
        {value != null && (
          <span className="selector-current">
            {value} — {dimension.scaleDefinitions.find(d => d.score === value)?.label}
          </span>
        )}
      </div>

      <div className="score-buttons">
        {dimension.scaleDefinitions.map(def => (
          <button
            key={def.score}
            type="button"
            className={`score-btn${value === def.score ? ' selected' : ''}${hovered === def.score ? ' hovered' : ''}`}
            onClick={() => onChange(def.score)}
            onMouseEnter={() => setHovered(def.score)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`${def.score}: ${def.label}`}
          >
            {def.score}
          </button>
        ))}
      </div>

      <div className="score-detail">
        {activeDef ? (
          <>
            <div className="detail-title">
              <span className="detail-score">{activeDef.score}</span>
              <span className="detail-label">{activeDef.label}</span>
            </div>
            <p className="detail-description">{activeDef.description}</p>
            <ul className="detail-examples">
              {activeDef.examples.slice(0, 3).map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="detail-placeholder">Hover over a score to see its description</p>
        )}
      </div>
    </div>
  )
}
