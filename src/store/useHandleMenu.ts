import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IMenuState {
  isPrizeMenuOpen: boolean
  togglePrizeMenu: () => void
}

export const useHandleMenu = create<IMenuState>()(
  devtools(set => ({
    isPrizeMenuOpen: false,
    togglePrizeMenu: () =>
      set(state => ({ isPrizeMenuOpen: !state.isPrizeMenuOpen })),
  }))
)
