import type { MovementKind, StockItem } from '../types'

export function formatDate(value: string): string {
  if (!value) return '-'
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = new Date(dateOnly ? `${value}T12:00:00` : value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function movementLabel(kind: MovementKind): string {
  return kind === 'entry' ? 'Entrada' : 'Saída'
}

export function stockStatus(item: StockItem): 'out' | 'low' | 'ok' {
  if (item.quantity <= 0) return 'out'
  if (item.quantity <= 5) return 'low'
  return 'ok'
}

export function todayAsInputValue(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}
