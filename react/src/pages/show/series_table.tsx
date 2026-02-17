import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { handleSeriesDelete } from '@/api/shows'
import UpdateRating from './update_rating'
import type { SeriesType } from '@/store/types'

export default function SeriesTable({
    refreshData,
    editMode,
    data,
    type,
}: {
    refreshData: () => void
    editMode: boolean
    data: SeriesType[]
    type: string
}) {
    const ITEMS_PER_PAGE = 10
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
    const [page, setPage] = useState(1)
    const paginatedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <>
            <Table className="overflow-hidden">
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead>Дата выхода</TableHead>
                        <TableHead>Дата просмотра</TableHead>
                        <TableHead className="text-end px-3">Рейтинги</TableHead>
                        {editMode && (
                            <>
                                <TableHead>
                                    <Trash2 className="w-4" />
                                </TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((movie, index) => (
                        <motion.tr
                            key={movie.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.14 }}
                            className="hover:bg-muted/50 transition-colors"
                        >
                            <TableCell>{(page - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                            <TableCell className="">
                                <div className="flex gap-x-2 items-center">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.season_poster}`}
                                        alt="audio"
                                        className="w-12 rounded-sm"
                                    />
                                    <div className="flex flex-col">
                                        <h4 className="font-medium text-lg text-ellipsis whitespace-nowrap overflow-hidden max-w-[360px]">
                                            {movie.title} ({movie.original_title})
                                        </h4>
                                        <h4 className="font-light text-zinc-400">
                                            Season: {movie.season_number} (episodes_count: {movie.episodes_count})
                                        </h4>
                                        <h4 className="font-light text-zinc-400">Жанр: {movie.genre}</h4>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {movie.release_date}
                            </TableCell>
                            <TableCell>{movie.addition_date ?? '???'}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-y-2 items-end">
                                    <div className="bg-gradient-to-bl from-[#002a85] via-[#004cc6] to-[#002185] px-2 rounded-full w-20 text-center font-semibold">
                                        {movie.rating}
                                    </div>
                                    <div className="bg-gradient-to-bl from-cyan-950 via-cyan-700 to-cyan-900 px-2 rounded-full w-20 text-center font-semibold">
                                        {editMode ? (
                                            <UpdateRating
                                                placeholder={movie.personal_rating?.toString() ?? '???'}
                                                movie_id={movie.id}
                                                refreshData={refreshData}
                                                type={type}
                                            />
                                        ) : movie.personal_rating == null ? (
                                            '???'
                                        ) : (
                                            movie.personal_rating
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            {editMode && (
                                <>
                                    <TableCell>
                                        <Trash2
                                            className="text-red-500 hover:text-red-700 cursor-pointer w-4"
                                            onClick={async () => {
                                                await handleSeriesDelete(movie.id)
                                                refreshData()
                                            }}
                                        />
                                    </TableCell>
                                </>
                            )}
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
            <Pagination className="py-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    )
}
