import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TimerState {
  expiresAt: number | null;
  setExpiryDate: (expiresAt: string) => void;
  clearTimer: () => void;
}

const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      expiresAt: null,
      setExpiryDate: (expiresAt: string) => {
        set({ expiresAt: new Date(expiresAt).getTime() });
      },
      clearTimer: () => set({ expiresAt: null }),
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTimerStore;

