import type { AppView } from '../types'

export const STORAGE_KEY = 'corpsystem_uniform_movements'

export const UNIFORM_TYPES = [
  'Camiseta manga curta',
  'Camiseta manga longa',
  'Camisa social',
  'Calça operacional',
  'Calça social',
  'Bermuda',
  'Jaqueta',
  'Colete',
  'Avental',
  'Calçado de segurança',
  'Outro',
] as const

export const UNIFORM_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '34', '36', '38', '40', '42', '44', '46', '48'] as const

export const VIEW_LABELS: Record<AppView, string> = {
  home: 'Visão geral',
  movements: 'Entrada e saída',
  inventory: 'Estoque de uniformes',
}

export const LOW_STOCK_LIMIT = 5
