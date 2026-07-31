import { STORAGE_KEY } from '../data/constants'
import type { UniformMovement } from '../types'

export function loadMovements(): UniformMovement[] {
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as UniformMovement[]
    if (!Array.isArray(records)) return []

    return records.filter((record) => (
      record &&
      (record.kind === 'entry' || record.kind === 'exit') &&
      typeof record.uniformType === 'string' &&
      typeof record.size === 'string' &&
      Number.isFinite(record.quantity) &&
      record.quantity > 0
    ))
  } catch {
    return []
  }
}

export function saveMovements(movements: UniformMovement[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements))
}
