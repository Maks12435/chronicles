
import { create } from 'zustand'

export const BASE_URL = 'http://localhost:8080'

const now = new Date()
export const currentYear = now.getFullYear()


type YearState = {
    selectedYear: number
    setSelectedYear: (year: number) => void
}

const createYearStore = (defaultYear: number) =>
  create<YearState>((set) => ({
    selectedYear: defaultYear,
    setSelectedYear: (year) => set({ selectedYear: year }),
  }))

export const useSelectedYearMusic = createYearStore(currentYear)
export const useSelectedYearShows = createYearStore(currentYear)
export const useSelectedYearMatches = createYearStore(currentYear)
export const useSelectedYearBooks = createYearStore(currentYear)



interface User {
  username: string;
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
