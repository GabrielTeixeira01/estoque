import { AlertTriangle, ArrowDownLeft, ArrowRight, ArrowUpRight, Boxes, PackagePlus, Shirt } from 'lucide-react'
import type { AppView, StockItem, UniformMovement } from '../types'
import { formatDate, movementLabel } from '../utils/formatters'
import { EmptyState } from '../components/ui/EmptyState'

interface HomePageProps {
  movements: UniformMovement[]
  stock: StockItem[]
  onNavigate: (view: AppView) => void
}

export function HomePage({ movements, stock, onNavigate }: HomePageProps) {
  const totalUnits = stock.reduce((total, item) => total + Math.max(0, item.quantity), 0)
  const activeItems = stock.filter((item) => item.quantity > 0).length
  const deliveredUnits = movements
    .filter((movement) => movement.kind === 'exit')
    .reduce((total, movement) => total + movement.quantity, 0)
  const lowStockItems = stock.filter((item) => item.quantity <= 5)
  const recentMovements = [...movements]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Operação de almoxarifado</span>
          <h1>Visão geral do estoque</h1>
          <p>Acompanhe entradas, entregas e pontos de reposição dos uniformes.</p>
        </div>
        <button className="button button--primary" onClick={() => onNavigate('movements')}>
          <PackagePlus size={17} /> Nova movimentação
        </button>
      </div>

      <section className="metrics-grid metrics-grid--four" aria-label="Resumo do estoque">
        <article className="metric-card">
          <span className="metric-card__icon"><Boxes size={19} /></span>
          <p>Saldo total</p><strong>{totalUnits}</strong><small>Peças disponíveis</small>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--green"><Shirt size={19} /></span>
          <p>Itens ativos</p><strong>{activeItems}</strong><small>Tipos e tamanhos com saldo</small>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--purple"><ArrowUpRight size={19} /></span>
          <p>Peças entregues</p><strong>{deliveredUnits}</strong><small>Saídas acumuladas</small>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--amber"><AlertTriangle size={19} /></span>
          <p>Reposição</p><strong>{lowStockItems.length}</strong><small>Itens com até 5 peças</small>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="data-panel">
          <div className="section-heading">
            <div><span className="eyebrow">Histórico recente</span><h2>Últimas movimentações</h2></div>
            <button className="text-button" onClick={() => onNavigate('movements')}>Registrar nova</button>
          </div>

          {recentMovements.length === 0 ? (
            <EmptyState
              icon={Boxes}
              title="Estoque ainda sem movimentações"
              description="Cadastre a chegada da primeira remessa para começar o controle."
              action={<button className="button button--primary" onClick={() => onNavigate('movements')}>Cadastrar remessa</button>}
            />
          ) : (
            <div className="movement-list">
              {recentMovements.map((movement) => (
                <div className="movement-row" key={movement.id}>
                  <span className={`movement-icon movement-icon--${movement.kind}`}>
                    {movement.kind === 'entry' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                  </span>
                  <span className="movement-row__main">
                    <strong>{movement.uniformType}</strong>
                    <small>Tamanho {movement.size} · {movement.kind === 'entry' ? movement.supplier : movement.employee}</small>
                  </span>
                  <span className={`movement-kind movement-kind--${movement.kind}`}>{movementLabel(movement.kind)}</span>
                  <strong className="movement-quantity">{movement.kind === 'entry' ? '+' : '-'}{movement.quantity}</strong>
                  <time>{formatDate(movement.movementDate)}</time>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="restock-panel">
          <div className="section-heading">
            <div><span className="eyebrow">Atenção</span><h2>Pontos de reposição</h2></div>
            <button className="icon-button" onClick={() => onNavigate('inventory')} title="Ver estoque"><ArrowRight size={17} /></button>
          </div>
          {lowStockItems.length === 0 ? (
            <div className="compact-empty"><Boxes size={22} /><span>Nenhum estoque baixo no momento.</span></div>
          ) : (
            <div className="restock-list">
              {lowStockItems.slice(0, 7).map((item) => (
                <div className="restock-row" key={item.key}>
                  <span><strong>{item.uniformType}</strong><small>Tamanho {item.size}</small></span>
                  <span className={item.quantity <= 0 ? 'stock-number stock-number--out' : 'stock-number'}>{Math.max(0, item.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
