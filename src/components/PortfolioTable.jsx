import { useMemo } from 'react'
import { DIMENSIONS, calcWSJF } from '../App'

function wsjfClass(wsjf) {
  if (wsjf >= 5) return 'wsjf-high'
  if (wsjf >= 2.5) return 'wsjf-mid'
  return 'wsjf-low'
}

export function PortfolioTable({ items, onEdit, onDelete, onNewItem }) {
  const ranked = useMemo(() => {
    return items
      .map(item => {
        const { cod, wsjf } = calcWSJF(item.bv, item.tc, item.rrOe, item.jobSize)
        return { ...item, cod, wsjf }
      })
      .sort((a, b) => b.wsjf - a.wsjf)
      .map((item, i) => ({ ...item, rank: i + 1 }))
  }, [items])

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2>No items yet</h2>
        <p>Use the Calculator tab to score your first work item.</p>
        <button className="btn-primary" onClick={onNewItem}>Score First Item</button>
      </div>
    )
  }

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <div>
          <h2>Portfolio</h2>
          <p className="portfolio-sub">{items.length} item{items.length !== 1 ? 's' : ''}, ranked by WSJF</p>
        </div>
        <button className="btn-primary" onClick={onNewItem}>+ Add Item</button>
      </div>

      <div className="table-wrap">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th className="col-name">Work Item</th>
              <th title={DIMENSIONS.bv.definition.summary}>BV</th>
              <th title={DIMENSIONS.tc.definition.summary}>TC</th>
              <th title={DIMENSIONS.rrOe.definition.summary}>RR/OE</th>
              <th title="Cost of Delay = BV + TC + RR/OE">CoD</th>
              <th title={DIMENSIONS.jobSize.definition.summary}>Size</th>
              <th title="WSJF = CoD ÷ Job Size">WSJF</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map(item => (
              <tr key={item.id} className={item.rank === 1 ? 'row-top' : ''}>
                <td className="col-rank">{item.rank}</td>
                <td className="col-name">{item.name}</td>
                <td className="col-score">{item.bv}</td>
                <td className="col-score">{item.tc}</td>
                <td className="col-score">{item.rrOe}</td>
                <td className="col-cod">{item.cod}</td>
                <td className="col-score">{item.jobSize}</td>
                <td className={`col-wsjf ${wsjfClass(item.wsjf)}`}>{item.wsjf}</td>
                <td className="col-actions">
                  <button className="btn-action" onClick={() => onEdit(item)} title="Edit">Edit</button>
                  <button className="btn-action btn-action-danger" onClick={() => onDelete(item.id)} title="Delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="portfolio-legend">
        Formula: <strong>WSJF = (BV + TC + RR/OE) ÷ Job Size</strong>
        &nbsp;·&nbsp;
        <span className="legend-high">High ≥ 5</span>
        &nbsp;·&nbsp;
        <span className="legend-mid">Mid ≥ 2.5</span>
        &nbsp;·&nbsp;
        <span className="legend-low">Low &lt; 2.5</span>
      </p>
    </div>
  )
}
