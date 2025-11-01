import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { type BookType } from '@/static/types'
import { handleBookAdd, handleBooksearch } from '@/api/books'
import { useSelectedYearMusic } from '@/store/yearStore'

export default function AddBookBox({ refetchBooks }: { refetchBooks: () => void }) {
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        released_year: '',
        isbn: '',
        personal_rating: 0,
    })
    const [openDialog, setOpenDialog] = useState(false)
    const { selectedYear } = useSelectedYearMusic()
    const [findingBook, setFindingBook] = useState<BookType | null>(null)

    const handleChange = (field: keyof typeof bookData, value: string | number) => {
        setBookData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const searchBook = async () => {
        const result = await handleBooksearch(
            bookData.title,
            bookData.author,
            bookData.isbn,
            bookData.released_year ? Number(bookData.released_year) : undefined
        )
        if (result) {
            setFindingBook(result)
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <button
                    className="text-sm py-1 px-4 font-medium cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-primary"
                    style={{ fontFamily: 'Roboto' }}
                    onClick={() => setOpenDialog(true)}
                >
                    Add new book
                </button>
            </DialogTrigger>

            <DialogContent className="w-4xl">
                <DialogHeader>
                    <DialogTitle>Book search</DialogTitle>
                    <DialogDescription>Type book info to find it</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-x-4">
                    <div className="flex flex-col gap-y-4">
                        <div className="">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="book title"
                                value={bookData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </div>

                        <div className="">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                id="author"
                                placeholder="book author"
                                value={bookData.author}
                                onChange={(e) => handleChange('author', e.target.value)}
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="release">Released year</Label>
                            <Input
                                id="release"
                                placeholder="book release year"
                                value={bookData.released_year}
                                onChange={(e) => handleChange('released_year', e.target.value)}
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input
                                id="isbn"
                                placeholder="book isbn"
                                value={bookData.isbn}
                                onChange={(e) => handleChange('isbn', e.target.value)}
                            />
                        </div>

                        <Button type="button" className="mt-4 bg-zinc-900 text-primary" onClick={searchBook}>
                            Search
                        </Button>
                    </div>

                    {findingBook && (
                        <div className="flex flex-col items-center p-4">
                            <img src={findingBook.image} alt="Book" className="rounded-md w-[140px]" />
                            <h4 className="font-semibold text-xl">{findingBook.title}</h4>
                            <h5 className="text-zinc-400">{findingBook.author}</h5>
                            <Input
                                placeholder="put your rating"
                                type="number"
                                max={10}
                                min={0}
                                step={0.05}
                                value={findingBook.personal_rating ?? 0}
                                onChange={(e) => setFindingBook({ ...findingBook, personal_rating: Number(e.target.value) })}
                            />
                        </div>
                    )}
                </div>

                <Button
                    type="button"
                    className="bg-zinc-900 text-primary mt-4"
                    onClick={() => {
                        if (findingBook) {
                            handleBookAdd(findingBook, selectedYear, refetchBooks)
                            setFindingBook(null)
                        }
                    }}
                    disabled={!findingBook}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    )
}
