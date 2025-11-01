import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { DiaryType } from '@/static/types'
import { Filter } from 'lucide-react'

interface DiaryFiltersProps {
    records: DiaryType[]
    onFilterChange: (filters: { sortOrder: 'newest' | 'oldest'; filterType: string; filterYear: string }) => void
}

export default function DiaryFilters({ records, onFilterChange }: DiaryFiltersProps) {
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
    const [filterType, setFilterType] = useState<string>('all')
    const [filterYear, setFilterYear] = useState<string>('all')

    const recordTypes = useMemo(
        () => Array.from(new Set(records.map((r) => r.record_type).filter((t): t is string => !!t))),
        [records]
    )

    const recordYears = useMemo(
        () =>
            Array.from(new Set(records.map((r) => r.created_time?.slice(0, 4)).filter((y): y is string => !!y))).sort(
                (a, b) => +b - +a
            ),
        [records]
    )

    const applyFilters = () => {
        onFilterChange({ sortOrder, filterType, filterYear })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary"><Filter />Filters</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filters & Sorting</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Sort by time</p>
                    <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Select order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Filter by record type</p>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {recordTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Filter by year</p>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {recordYears.map((year) => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end pt-3">
                    <Button onClick={applyFilters}>Apply</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
