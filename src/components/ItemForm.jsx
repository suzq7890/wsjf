import { useState } from 'react'
import { DIMENSIONS, calcWSJF } from '../App'
import { ScoreSelector } from './ScoreSelector'

export function ItemForm({ initialValues, onSubmit, onCancel }) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [bv, setBv] = useState(initialValues?.bv ?? null)
  const [tc, setTc] = useState(initialValues?.tc ?? null)
  const [rrOe, setRrOe] = useState(initialValues?.rrOe ?? null)
  const [size, setSize] = useState(initialValues?.jobSize ?? null)

  const isEditing = !!initialValues
  const allScored = bv != null && tc != null && rrOe != null && size != null
  const preview = allScored ? calcWSJF(bv, tc, rrOe, size) : null
  const canSubmit = name.trim().length > 0 && allScored

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ name: name.trim(), bv, tc, rrOe, jobSize: size })
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{isEditing ? 'Edit Work Item' : 'Score a Work Item'}</h2>
        <p>Assign a score (1–10) to each dimension. Hover any score to read its description.</p>
      </div>

      <div className="form-name-row">
        <label htmlFor="item-name">Work Item Name</label>
        <input
          id="item-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Improve checkout conversion, Migrate auth service..."
          required
        />
      </div>

      <div className="form-body">
        <div className="cod-group">
          <div className="group-label">
            <span className="group-title">Cost of Delay</span>
            <span className="group-formula">CoD = BV + TC + RR/OE</span>
          </div>
          <ScoreSelector
            dimension={DIMENSIONS.bv}
            label="Business Value (BV)"
            value={bv}
            onChange={setBv}
          />
          <ScoreSelector
            dimension={DIMENSIONS.tc}
            label="Time Criticality (TC)"
            value={tc}
            onChange={setTc}
          />
          <ScoreSelector
            dimension={DIMENSIONS.rrOe}
            label="Risk Reduction / Opportunity Enablement (RR/OE)"
            value={rrOe}
            onChange={setRrOe}
          />
        </div>

        <div className="size-group">
          <div className="group-label">
            <span className="group-title">Job Size</span>
            <span className="group-formula">Divisor in WSJF</span>
          </div>
          <ScoreSelector
            dimension={DIMENSIONS.jobSize}
            label="Job Size"
            value={size}
            onChange={setSize}
          />
        </div>
      </div>

      <div className={`wsjf-preview${preview ? ' has-result' : ''}`}>
        <div className="preview-inner">
          <PreviewCell label="BV" value={bv} />
          <span className="preview-op">+</span>
          <PreviewCell label="TC" value={tc} />
          <span className="preview-op">+</span>
          <PreviewCell label="RR/OE" value={rrOe} />
          <span className="preview-op">=</span>
          <PreviewCell label="CoD" value={preview?.cod} highlight="cod" />
          <span className="preview-op">÷</span>
          <PreviewCell label="Size" value={size} />
          <span className="preview-op">=</span>
          <PreviewCell label="WSJF" value={preview?.wsjf} highlight="wsjf" />
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {isEditing ? 'Save Changes' : 'Add to Portfolio'}
        </button>
      </div>
    </form>
  )
}

function PreviewCell({ label, value, highlight }) {
  return (
    <div className={`preview-cell${highlight ? ` preview-${highlight}` : ''}`}>
      <span className="preview-label">{label}</span>
      <span className="preview-value">{value ?? '—'}</span>
    </div>
  )
}
