import { ArrowDownUp, Boxes, LayoutDashboard } from 'lucide-react'
import type { AppView } from '../../types'

interface SidebarProps {
  activeView: AppView
  totalUnits: number
  lowStockCount: number
  onNavigate: (view: AppView) => void
}

const navigation = [
  { view: 'home' as const, label: 'Visão geral', icon: LayoutDashboard },
  { view: 'movements' as const, label: 'Entrada e saída', icon: ArrowDownUp },
  { view: 'inventory' as const, label: 'Estoque', icon: Boxes },
]

export function Sidebar({ activeView, totalUnits, lowStockCount, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <button className="brand brand--sidebar" onClick={() => onNavigate('home')}>
        <span className="brand__logo">
          <img src="/corpsystem-logo.png" alt="" />
        </span>
        <span>
          <strong>CorpUniformes</strong>
          <small>Controle de estoque</small>
        </span>
      </button>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {navigation.map(({ view, label, icon: Icon }) => {
          const isActive = activeView === view
          return (
            <button
              key={view}
              className={`nav-button${isActive ? ' nav-button--active' : ''}`}
              onClick={() => onNavigate(view)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar-stats">
          <div><strong>{totalUnits}</strong><span>Peças disponíveis</span></div>
          <div><strong>{lowStockCount}</strong><span>Estoques baixos</span></div>
        </div>
      </div>
    </aside>
  )
}
