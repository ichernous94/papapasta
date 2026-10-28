import { create } from 'zustand';

interface BurgerMenuState {
  isBurgerMenuOpen: boolean;
  openBurgerMenu: () => void;
  closeBurgerMenu: () => void;
  toggleBurgerMenu: () => void;
}

const useBurgerMenuStore = create<BurgerMenuState>((set) => ({
  isBurgerMenuOpen: false,
  openBurgerMenu: () => set({ isBurgerMenuOpen: true }),
  closeBurgerMenu: () => set({ isBurgerMenuOpen: false }),
  toggleBurgerMenu: () => set((state) => ({ isBurgerMenuOpen: !state.isBurgerMenuOpen })),
}));

export default useBurgerMenuStore;
