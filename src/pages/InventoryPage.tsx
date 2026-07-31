import { Boxes, Search } from 'lucide-react'
import { useState } from 'react'
import { UNIFORM_SIZES } from '../data/constants'
import type { StockItem } from '../types'
import { formatDate, stockStatus } from '../utils/formatters'
import { EmptyState } from '../components/ui/EmptyState'

interface InventoryPageProps {
  stock: StockItem[]
}

export function InventoryPage({ stock }: InventoryPageProps) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [size, setSize] = useState('')
  const [status, setStatus] = useState('')
  const types = [...new Set(stock.map((item) => item.uniformType))].sort((a, b) => a.localeCompare(b, 'pt-BR'))

  const query = search.trim().toLocaleLowerCase('pt-BR')
  const filteredStock = stock.filter((item) => {
    const itemStatus = stockStatus(item)
    return (
      (!query || item.uniformType.toLocaleLowerCase('pt-BR').includes(query) || item.lastSupplier.toLocaleLowerCase('pt-BR').includes(query)) &&
      (!type || item.uniformType === type) &&
      (!size || item.size === size) &&
      (!status || itemStatus === status)
    )
  })

  const totalUnits = filteredStock.reduce((total, item) => total + Math.max(0, item.quantity), 0)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Consulta consolidada</span>
          <h1>Estoque de uniformes</h1>
          <p>Saldo calculado a partir de todas as entradas e saídas registradas.</p>
        </div>
        <div className="inventory-total"><small>Saldo filtrado</small><strong>{totalUnits} peças</strong></div>
      </div>

      <section className="inventory-panel">
        <div className="inventory-toolbar">
          <label className="search-control"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto ou fornecedor" /></label>
          <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filtrar por tipo"><option value="">Todos os tipos</option>{types.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={size} onChange={(event) => setSize(event.target.value)} aria-label="Filtrar por tamanho"><option value="">Todos os tamanhos</option>{UNIFORM_SIZES.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filtrar por situação"><option value="">Todas as situações</option><option value="ok">Disponível</option><option value="low">Estoque baixo</option><option value="out">Sem estoque</option></select>
        </div>

        {filteredStock.length === 0 ? (
          <EmptyState icon={Boxes} title="Nenhum item encontrado" description={stock.length === 0 ? 'O estoque aparecerá aqui após a primeira entrada.' : 'Ajuste os filtros para localizar outro item.'} />
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>Uniforme</th><th>Tamanho</th><th>Último fornecedor</th><th>Entradas</th><th>Saídas</th><th>Saldo</th><th>Situação</th><th>Atualizado</th></tr></thead>
              <tbody>
                {filteredStock.map((item) => {
                  const itemStatus = stockStatus(item)
                  return (
                    <tr key={item.key}>
                      <td><strong className="product-name">{item.uniformType}</strong></td>
                      <td><span className="size-badge">{item.size}</span></td>
                      <td>{item.lastSupplier || '-'}</td>
                      <td>{item.totalEntries}</td>
                      <td>{item.totalExits}</td>
                      <td><strong className="balance-cell">{Math.max(0, item.quantity)}</strong></td>
                      <td><span className={`status-badge status-badge--${itemStatus}`}>{itemStatus === 'ok' ? 'Disponível' : itemStatus === 'low' ? 'Estoque baixo' : 'Sem estoque'}</span></td>
                      <td>{formatDate(item.lastMovementAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
