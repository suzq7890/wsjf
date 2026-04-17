import { useState, useEffect } from 'react'
import businessValue from './data/business_value.json'
import timeCriticality from './data/time_criticality.json'
import riskReduction from './data/risk_reduction.json'
import jobSize from './data/job_size.json'
import { ItemForm } from './components/ItemForm'
import { PortfolioTable } from './components/PortfolioTable'

export const DIMENSIONS = {
  bv: businessValue,
  tc: timeCriticality,
  rrOe: riskReduction,
  jobSize: jobSize,
}

export function calcWSJF(bv, tc, rrOe, size) {
  const cod = bv + tc + rrOe
  const wsjf = size > 0 ? Math.round((cod / size) * 100) / 100 : 0
  return { cod, wsjf }
}

function loadItems() {
  try {
    return JSON.parse(localStorage.getItem('wsjf-items') || '[]')
  } catch {
    return []
  }
}

export default function App() {
  const [tab, setTab] = useState('calculator')
  const [items, setItems] = useState(loadItems)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    localStorage.setItem('wsjf-items', JSON.stringify(items))
  }, [items])

  function handleSubmit(formData) {
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? { ...formData, id: i.id } : i))
      setEditingItem(null)
    } else {
      setItems(prev => [...prev, { ...formData, id: Date.now() }])
    }
    setTab('portfolio')
  }

  function handleEdit(item) {
    setEditingItem(item)
    setTab('calculator')
  }

  function handleDelete(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function handleNewItem() {
    setEditingItem(null)
    setTab('calculator')
  }

  function handleCancel() {
    setEditingItem(null)
    setTab('portfolio')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-text">
          <h1>WSJF Calculator</h1>
          <p className="header-sub">Weighted Shortest Job First — SAFe Portfolio Prioritization</p>
        </div>
        <div className="header-formula">
          <span className="formula">WSJF = (BV + TC + RR/OE) ÷ Job Size</span>
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-btn${tab === 'calculator' ? ' active' : ''}`}
          onClick={() => { setEditingItem(null); setTab('calculator') }}
        >
          Calculator
        </button>
        <button
          className={`tab-btn${tab === 'portfolio' ? ' active' : ''}`}
          onClick={() => setTab('portfolio')}
        >
          Portfolio
          {items.length > 0 && <span className="tab-badge">{items.length}</span>}
        </button>
      </nav>

      <main className="main-content">
        {tab === 'calculator' ? (
          <ItemForm
            key={editingItem?.id ?? 'new'}
            initialValues={editingItem}
            onSubmit={handleSubmit}
            onCancel={items.length > 0 ? handleCancel : undefined}
          />
        ) : (
          <PortfolioTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNewItem={handleNewItem}
          />
        )}
      </main>
    </div>
  )
}
