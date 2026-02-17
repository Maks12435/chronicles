import { fetchDiaryRecords, handleDiaryRecordDelete } from '@/api/diary'
import RecordAdd from './record_add'
import { useQuery } from '@tanstack/react-query'
import type { DiaryType } from '@/store/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useMemo } from 'react'
import RecordUpdate from './record_update'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Expand, Trash } from 'lucide-react'
import DiaryFilters from './diary_filter'

export default function Diary() {
    const { data: records = [], refetch: refetchDiaryRecords } = useQuery<DiaryType[]>({
        queryFn: fetchDiaryRecords,
        queryKey: ['diary'],
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })

    const [filters, setFilters] = useState({
        sortOrder: 'newest' as 'newest' | 'oldest',
        filterType: 'all',
        filterYear: 'all',
    })

    const filteredRecords = useMemo(() => {
        let filtered = [...records]

        if (filters.filterType !== 'all') {
            filtered = filtered.filter((r) => r.record_type === filters.filterType)
        }

        if (filters.filterYear !== 'all') {
            filtered = filtered.filter((r) => (r.created_time ? r.created_time.slice(0, 4) : '') === filters.filterYear)
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.created_time ?? 0).getTime()
            const dateB = new Date(b.created_time ?? 0).getTime()
            return filters.sortOrder === 'newest' ? dateB - dateA : dateA - dateB
        })

        return filtered
    }, [records, filters])

    return (
        <div className="container">
            <div className="flex justify-between py-2 items-center">
                <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                    Diary records
                </h3>
                <div className="flex items-center gap-x-2">
                    <DiaryFilters records={records} onFilterChange={setFilters} />
                    <RecordAdd refetchData={refetchDiaryRecords} />
                </div>
            </div>

            <div className="flex flex-col gap-y-3">
                {filteredRecords.map((item, index) => (
                    <RecordBox key={index} data={item} refetchData={refetchDiaryRecords} />
                ))}
            </div>
        </div>
    )
}

function RecordBox({ data, refetchData }: { data: DiaryType; refetchData: () => void }) {
    const [expandedMode, setExpandedMode] = useState(false)

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-end">
                    <CardTitle>
                        {data.title}, ({data.record_type[0].toUpperCase() + data.record_type.slice(1)})
                    </CardTitle>

                    <div className="flex items-center gap-x-2">
                        {expandedMode && (
                            <>
                                {data.id !== null && (
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Trash
                                                strokeWidth={2}
                                                size={20}
                                                className="text-zinc-400 hover:text-zinc-50"
                                            />
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you sure that want to delete this data?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your data
                                                    and remove your data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={async () => {
                                                        await handleDiaryRecordDelete(data.id!, refetchData),
                                                            setExpandedMode(false)
                                                    }}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                <RecordUpdate data={data} refetchData={refetchData}></RecordUpdate>
                            </>
                        )}
                        <button
                            onClick={() => setExpandedMode(!expandedMode)}
                            className="text-zinc-400 hover:text-zinc-50"
                        >
                            <Expand strokeWidth={2} width={20} />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription
                    className={`text-justify overflow-y-hidden text-ellipsis ${
                        expandedMode ? 'max-h-full' : 'max-h-[140px]'
                    }`}
                >
                    {data.description}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-end">
                <p className="text-sm">
                    {data.created_time?.slice(0, 10)}
                </p>
            </CardFooter>
        </Card>
    )
}
