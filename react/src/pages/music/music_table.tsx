import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/table'
import { currentYear } from '@/store/storage'
import type { TrackType } from '@/static/types'
import { useSelectedYearMusic } from '@/store/yearStore'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Clock, Repeat, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { handleDelete, handleSwapRankNext, handleSwapRankPrevious } from '@/api/tracks'

export default function MusicTable({
    refreshData,
    editMode,
    tracks,
}: {
    refreshData: () => void
    editMode: boolean
    tracks: TrackType[]
}) {
    const ITEMS_PER_PAGE = 10
    const [page, setPage] = useState(1)
    const { selectedYear } = useSelectedYearMusic()

    const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE)
    const paginatedData = tracks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <>
            <Table className="overflow-hidden">
                <TableHeader>
                    <TableHead>#</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Альбом</TableHead>
                    <TableHead>Дата добавления</TableHead>
                    <TableHead>
                        <div className="flex justify-center items-center">
                            <Clock className="w-4" />
                        </div>
                    </TableHead>
                    {editMode && currentYear <= parseInt(selectedYear) && (
                        <>
                            <TableHead>
                                <Trash2 className="w-4" />
                            </TableHead>
                            <TableHead>
                                <Repeat className="w-4" />
                            </TableHead>
                        </>
                    )}
                </TableHeader>
                <TableBody>
                    {paginatedData.map((song, index) => (
                        <motion.tr
                            key={song.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.14 }}
                            className="hover:bg-muted/50 transition-colors"
                        >
                            <TableCell>{(page - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                            <TableCell>
                                <div className="flex gap-x-2 items-center">
                                    <img src={song.image} alt="audio" className="w-12 rounded-sm" />
                                    <div className="flex flex-col">
                                        <h4 className="w-64 whitespace-nowrap overflow-hidden text-ellipsis font-medium text-lg">
                                            {song.title}
                                        </h4>
                                        <h4 className="font-medium text-zinc-400">{song.artist}</h4>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <h4 className="w-60 whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                                    {song.album}
                                </h4>
                            </TableCell>
                            <TableCell>{song.date}</TableCell>
                            <TableCell className="text-center">{song.duration}</TableCell>
                            {editMode && currentYear <= parseInt(selectedYear) && (
                                <>
                                    <TableCell>
                                        <Trash2
                                            className="text-red-500 hover:text-red-700 cursor-pointer w-4"
                                            onClick={async () => {
                                                await handleDelete(song.id)
                                                refreshData()
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ChevronUp
                                            className="w-5 cursor-pointer"
                                            onClick={async () => {
                                                await handleSwapRankNext(song.id)
                                                refreshData()
                                            }}
                                        />
                                        <ChevronDown
                                            className="w-5 h-5 cursor-pointer"
                                            onClick={async () => {
                                                await handleSwapRankPrevious(song.id)
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
