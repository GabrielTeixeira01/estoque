import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { useUniformInventory } from './hooks/useUniformInventory'
import { HomePage } from './pages/HomePage'
import { InventoryPage } from './pages/InventoryPage'
import { MovementsPage } from './pages/MovementsPage'
import type { AppView } from './types'

export default function App() {
  const [view, setView] = useState<AppView>('home')
  const inventory = useUniformInventory()

  return (
    <AppShell
      view={view}
      movements={inventory.movements}
      stock={inventory.stock}
      onNavigate={setView}
    >
      {view === 'home' && (
        <HomePage
          movements={inventory.movements}
          stock={inventory.stock}
          onNavigate={setView}
        />
      )}
      {view === 'movements' && (
        <MovementsPage
          stock={inventory.stock}
          getAvailableQuantity={inventory.getAvailableQuantity}
          onRegisterEntry={inventory.registerEntry}
          onRegisterExit={inventory.registerExit}
        />
      )}
      {view === 'inventory' && (
        <InventoryPage stock={inventory.stock} />
      )}
    </AppShell>
  )
}
