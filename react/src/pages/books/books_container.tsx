import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronUp, Edit, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type ArtistType, type BookType, type TrackType } from '@/static/types'
import {
    Select,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '../../components/ui/select'
import { FootballTotal, musicTotal } from '@/static/localdb'
import { useQuery } from '@tanstack/react-query'
import { fetchBooks } from '@/api/books'
import { currentYear } from '@/store/storage'
import AddbookBox from '@/pages/music/music_add'
import { useSelectedYearMusic } from '@/store/yearStore'
import { Button } from '@/components/ui/button'
import BooksTable from './books_table'
import AddBookBox from './book_add'

export default function BooksStatistics() {
    const [editMode, setEditMode] = useState(false)
    const { selectedYear, setSelectedYear } = useSelectedYearMusic()

    const {
        data: books = [],
        isLoading,
        isError,
        refetch: refetchBooks,
    } = useQuery<BookType[]>({
        queryKey: ['books', selectedYear],
        queryFn: () => fetchBooks(selectedYear),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    })

    return (
        <div className="container">
            <div className="grid grid-cols-10 gap-x-4 relative pt-6">
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-center gap-y-4">
                    <div className="flex">
                        <Select onValueChange={(value) => setSelectedYear(value)}>
                            <SelectTrigger className="border-none bg-transparent [&>svg]:hidden">
                                <SelectValue placeholder="Select the year"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Years</SelectLabel>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Table>
                        <TableBody className="text-md">
                            <TableRow>
                                <TableCell>Book of the year</TableCell>
                                <TableCell>{FootballTotal[selectedYear].team}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Author of the year</TableCell>
                                <TableCell>{FootballTotal[selectedYear].player}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-transparent to-transparent pointer-events-none z-20" />
                <div className="col-span-5">
                    <div className="relative">
                        <img
                            src={
                                selectedYear === '2025'
                                    ? '/assets/images/books.png'
                                    : selectedYear === '2024'
                                    ? '/assets/images/books.png'
                                    : 'none'
                            }
                            alt="stars"
                            className="w-full"
                        />

                        <div className="flex flex-col">
                            <div className="absolute bottom-0 w-full pb-8" style={{ fontFamily: 'Staatliches' }}>
                                <h3
                                    className="text-7xl font-bold tracking-wider text-nowrap text-zinc-300 absolute right-0 bottom-14"
                                    style={{
                                        fontFamily: 'Staatliches',
                                    }}
                                >
                                    the best books of this year
                                </h3>
                                <div className="flex gap-x-8 justify-end">
                                    <h4>John Green</h4>
                                    <h4>Plato</h4>
                                    <h4>Aristotele</h4>
                                    <h4>Joan Rouling</h4>
                                    <h4>Aghata Cristie</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="h-[1px] bg-zinc-600" />

            <div className="grid grid-cols-10 gap-x-6 pt-4">
                <div className="col-span-7">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                            Top 30 best books of this year
                        </h3>
                        <div className="flex items-center gap-x-2">
                            <AddBookBox refetchBooks={refetchBooks} />
                            <button
                                onClick={() => setEditMode(!editMode)}
                                disabled={currentYear > parseInt(selectedYear)}
                            >
                                <Edit
                                    className={currentYear > parseInt(selectedYear) ? 'w-5 text-zinc-500' : 'w-5'}
                                    strokeWidth={2}
                                />
                            </button>
                        </div>
                    </div>

                    <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />

                    {isLoading && (
                        <div className="flex justify-center items-center h-[160px]">
                            <Loader2 className="w-26 h-26 animate-spin text-zinc-700" />
                        </div>
                    )}

                    {isError && (
                        <div className="flex flex-col justify-center items-center h-[200px] gap-y-2">
                            <p className="text-red-700 text-lg font-semibold">Error durning loading data</p>
                            <Button onClick={() => refetchBooks()} variant={'custom'} className="max-w-48">
                                Retry
                            </Button>
                        </div>
                    )}

                    {!isLoading && !isError && (
                        <BooksTable refreshData={refetchBooks} editMode={editMode} books={books} />
                    )}
                </div>
                <div className="col-span-3"></div>
            </div>
        </div>
    )
}
