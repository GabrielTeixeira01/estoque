import { Bell, PackageSearch } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LOW_STOCK_LIMIT, VIEW_LABELS } from '../../data/constants'
import type { AppView, StockItem, UniformMovement } from '../../types'

interface TopbarProps {
  view: AppView
  movements: UniformMovement[]
  stock: StockItem[]
}

export function Topbar({ view, movements, stock }: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const alerts = stock.filter((item) => item.quantity <= LOW_STOCK_LIMIT).slice(0, 6)

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', closeDropdown)
    return () => document.removeEventListener('mousedown', closeDropdown)
  }, [])

  return (
    <header className="topbar">
      <p className="breadcrumb">CorpUniformes <span>/</span> <strong>{VIEW_LABELS[view]}</strong></p>

      <div className="topbar__actions">
        <span className="sync-status"><span /> Dados salvos neste dispositivo</span>
        <div className="notifications" ref={wrapperRef}>
          <button
            className="icon-button"
            onClick={() => setIsOpen((current) => !current)}
            aria-label="Abrir alertas de estoque"
            aria-expanded={isOpen}
          >
            <Bell size={18} />
            {alerts.length > 0 && <span className="notification-dot" />}
          </button>

          {isOpen && (
            <div className="notification-panel">
              <div className="notification-panel__header">
                <strong>Alertas de estoque</strong>
                <span>{alerts.length}</span>
              </div>
              {alerts.length === 0 ? (
                <p className="notification-panel__empty">Nenhum item precisa de reposição.</p>
              ) : (
                <div className="notification-list">
                  {alerts.map((item) => (
                    <div className="notification-item" key={item.key}>
                      <span className="notification-item__icon"><PackageSearch size={16} /></span>
                      <span>
                        <strong>{item.uniformType} · {item.size}</strong>
                        <small>{item.quantity <= 0 ? 'Sem estoque' : `${item.quantity} peças restantes`}</small>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {movements.length === 0 && <p className="notification-hint">Registre a primeira remessa para iniciar o controle.</p>}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
