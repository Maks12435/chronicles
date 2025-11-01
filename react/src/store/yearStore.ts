import { create } from 'zustand'

type YearState = {
    selectedYear: string
    setSelectedYear: (year: string) => void
}

const createYearStore = (defaultYear: string) =>
  create<YearState>((set) => ({
    selectedYear: defaultYear,
    setSelectedYear: (year) => set({ selectedYear: year }),
  }))

export const useSelectedYearMusic = createYearStore("2025")
export const useSelectedYearShows = createYearStore("2025")
export const useSelectedYearMatches = createYearStore("2025")
export const useSelectedYearBooks = createYearStore("2025")