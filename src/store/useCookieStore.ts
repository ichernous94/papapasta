import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CookieState {
  isAccept: boolean;
  setAccept: () => void;
}

const useCookieStore = create(
  persist<CookieState>(
    (set) => ({
      isAccept: false,
      setAccept: () => set(() => ({ isAccept: true })),
    }),
    {
      name: 'cookie-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCookieStore;
