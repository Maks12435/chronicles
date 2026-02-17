import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { currentYear } from '@/store/global-variables'
import type { BookType } from '@/store/types'
import { useSelectedYearBooks } from '@/store/global-variables'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { handleDelete } from '@/api/books'
import UpdateRating from './update_rating'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

export default function BooksTable({
    refreshData,
    editMode,
    books,
}: {
    refreshData: () => void
    editMode: boolean
    books: BookType[]
}) {
    const ITEMS_PER_PAGE = 10
    const [page, setPage] = useState(1)
    const { selectedYear } = useSelectedYearBooks()
    const [open, setOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<BookType | null>(null)

    const handleOpen = (book: BookType) => {
        setSelectedBook(book)
        setOpen(true)
    }

    const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE)
    const paginatedData = books.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <>
            <Table className="overflow-hidden">
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead>Автор</TableHead>
                        <TableHead>Дата выхода</TableHead>
                        <TableHead className="text-end">Рейтинг</TableHead>
                        {editMode && currentYear <= selectedYear && (
                            <>
                                <TableHead>
                                    <Trash2 className="w-4" />
                                </TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((book, index) => (
                        <>
                            <motion.tr
                                key={book.id}
                                onClick={() => handleOpen(book)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.14 }}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                <TableCell>{(page - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex gap-x-2 items-center">
                                        <img
                                            src={book.image ? book.image : 'assets/images/question.jpeg'}
                                            alt="audio"
                                            className="w-12 rounded-sm object-cover h-full"
                                        />
                                        <div className="flex flex-col">
                                            <h4 className="w-64 whitespace-nowrap overflow-hidden text-ellipsis font-medium text-lg">
                                                {book.title}
                                            </h4>
                                            <h4 className="font-medium text-zinc-400">ISBN: {book.isbn}</h4>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <h4 className="w-60 whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                                        {book.author}
                                    </h4>
                                </TableCell>
                                <TableCell>{book.released_year}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-y-2 items-end">
                                        <div className="bg-gradient-to-bl from-[#002a85] via-[#004cc6] to-[#002185] px-2 rounded-full w-20 text-center font-semibold">
                                            {book.average_rating}
                                        </div>
                                        <div className="bg-gradient-to-bl from-cyan-950 via-cyan-700 to-cyan-900 px-2 rounded-full w-20 text-center font-semibold">
                                            {editMode ? (
                                                <UpdateRating
                                                    placeholder={book.personal_rating?.toString() ?? '???'}
                                                    book_id={book.id}
                                                    refreshData={refreshData}
                                                />
                                            ) : book.personal_rating == null ? (
                                                '???'
                                            ) : (
                                                book.personal_rating
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                {editMode && currentYear <= selectedYear && (
                                    <>
                                        <TableCell>
                                            <Trash2
                                                className="text-red-500 hover:text-red-700 cursor-pointer w-4"
                                                onClick={async (e) => {
                                                    e.stopPropagation()
                                                    await handleDelete(book.id)
                                                    refreshData()
                                                }}
                                            />
                                        </TableCell>
                                    </>
                                )}
                            </motion.tr>
                        </>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onOpenChange={setOpen}>
                {selectedBook && (
                    <>
                        <DialogContent className="min-w-2xl">
                            <div className="flex gap-x-2">
                                <img
                                    src={selectedBook.image || 'assets/images/question.jpeg'}
                                    alt={selectedBook.title}
                                    className="w-32 rounded-md object-cover"
                                />
                                <div className="">
                                    <div className="flex flex-col gap-y-2">
                                        <DialogTitle>{selectedBook.title}</DialogTitle>
                                        <div className="flex flex-col gap-y-[2px] text-[12px]">
                                            <p>Author: {selectedBook.author}</p>
                                            <p>Release date: {selectedBook.released_year}</p>
                                            <p>ISBN: {selectedBook.isbn}</p>
                                            <p>Price: {selectedBook.price}</p>
                                            <p>Average_rating: {selectedBook.average_rating}</p>
                                            <p>Personal_rating: {selectedBook.personal_rating}</p>
                                            <p>Language: {selectedBook.language}</p>
                                            <p>Country: {selectedBook.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-x-2">
                                <h3>Description:</h3>
                                <DialogDescription>{selectedBook.description || 'No description'}</DialogDescription>
                            </div>
                        </DialogContent>
                    </>
                )}
            </Dialog>

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
