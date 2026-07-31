export type AppView = 'home' | 'movements' | 'inventory'

export type MovementKind = 'entry' | 'exit'

export interface UniformMovement {
  id: string
  kind: MovementKind
  uniformType: string
  size: string
  quantity: number
  movementDate: string
  createdAt: string
  supplier?: string
  employee?: string
  registration?: string
  department?: string
  notes?: string
}

export interface EntryFormData {
  uniformType: string
  size: string
  quantity: string
  supplier: string
  movementDate: string
  notes: string
}

export interface ExitFormData {
  uniformType: string
  size: string
  quantity: string
  employee: string
  registration: string
  department: string
  movementDate: string
  notes: string
}

export interface StockItem {
  key: string
  uniformType: string
  size: string
  quantity: number
  totalEntries: number
  totalExits: number
  lastSupplier: string
  lastMovementAt: string
}

export type FormErrors<T> = Partial<Record<keyof T, string>>
