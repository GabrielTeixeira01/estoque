import { useEffect, useMemo, useState } from 'react'
import { loadMovements, saveMovements } from '../services/uniformStorage'
import type { EntryFormData, ExitFormData, StockItem, UniformMovement } from '../types'

const stockKey = (uniformType: string, size: string) => `${uniformType}::${size}`

export function useUniformInventory() {
  const [movements, setMovements] = useState<UniformMovement[]>(loadMovements)

  useEffect(() => {
    saveMovements(movements)
  }, [movements])

  const stock = useMemo(() => {
    const items = new Map<string, StockItem>()
    const orderedMovements = [...movements]
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    orderedMovements.forEach((movement) => {
      const key = stockKey(movement.uniformType, movement.size)
      const current = items.get(key) ?? {
        key,
        uniformType: movement.uniformType,
        size: movement.size,
        quantity: 0,
        totalEntries: 0,
        totalExits: 0,
        lastSupplier: '',
        lastMovementAt: movement.createdAt,
      }

      if (movement.kind === 'entry') {
        current.quantity += movement.quantity
        current.totalEntries += movement.quantity
        current.lastSupplier = movement.supplier ?? current.lastSupplier
      } else {
        current.quantity -= movement.quantity
        current.totalExits += movement.quantity
      }
      current.lastMovementAt = movement.createdAt
      items.set(key, current)
    })

    return [...items.values()].sort((a, b) => (
      a.uniformType.localeCompare(b.uniformType, 'pt-BR') || a.size.localeCompare(b.size, 'pt-BR')
    ))
  }, [movements])

  const getAvailableQuantity = (uniformType: string, size: string) => (
    stock.find((item) => item.key === stockKey(uniformType, size))?.quantity ?? 0
  )

  const registerEntry = (form: EntryFormData) => {
    const movement: UniformMovement = {
      id: crypto.randomUUID(),
      kind: 'entry',
      uniformType: form.uniformType,
      size: form.size,
      quantity: Number(form.quantity),
      supplier: form.supplier.trim(),
      movementDate: form.movementDate,
      notes: form.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    setMovements((current) => [movement, ...current])
    return movement
  }

  const registerExit = (form: ExitFormData) => {
    const quantity = Number(form.quantity)
    if (quantity > getAvailableQuantity(form.uniformType, form.size)) return null

    const movement: UniformMovement = {
      id: crypto.randomUUID(),
      kind: 'exit',
      uniformType: form.uniformType,
      size: form.size,
      quantity,
      employee: form.employee.trim(),
      registration: form.registration.trim() || undefined,
      department: form.department.trim() || undefined,
      movementDate: form.movementDate,
      notes: form.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    setMovements((current) => [movement, ...current])
    return movement
  }

  return { movements, stock, getAvailableQuantity, registerEntry, registerExit }
}
