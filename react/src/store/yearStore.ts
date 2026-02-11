import { create } from 'zustand'
import { currentYear } from './storage'

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