import type { AppView, StockItem, UniformMovement } from '../../types'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface AppShellProps {
  view: AppView
  movements: UniformMovement[]
  stock: StockItem[]
  onNavigate: (view: AppView) => void
  children: React.ReactNode
}

export function AppShell({ view, movements, stock, onNavigate, children }: AppShellProps) {
  const totalUnits = stock.reduce((total, item) => total + Math.max(0, item.quantity), 0)
  const lowStockCount = stock.filter((item) => item.quantity > 0 && item.quantity <= 5).length

  return (
    <div className="app-shell">
      <Sidebar
        activeView={view}
        totalUnits={totalUnits}
        lowStockCount={lowStockCount}
        onNavigate={onNavigate}
      />
      <div className="app-shell__content">
        <Topbar view={view} movements={movements} stock={stock} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
