import { Card } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronUp, Clock, Edit, Repeat, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import type { MovieType } from '@/static/types'
import type { ArtistCountType } from '@/static/types'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination'
import { Select, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '../ui/select'
import { useNavigate } from '@tanstack/react-router'

const COLORS = ['rgb(3, 71, 134)', 'rgb(21, 85, 176)', 'rgb(79, 132, 205)', 'rgb(129, 160, 204)']

export default function ShowStatistics() {
    const [showData, setShowData] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [movieName, setmovieName] = useState('')
    const [selectedYear, setSelectedYear] = useState('2025')

    const [moviesAll, setMoviesAll] = useState<MovieType[]>([])
    const [movies, setMovies] = useState<MovieType[]>([])
    const [findingMovie, setFindingMovie] = useState<MovieType | null>(null)

    const ITEMS_PER_PAGE = 10
    const totalPages = Math.ceil(moviesAll.length / ITEMS_PER_PAGE)
    const [page, setPage] = useState(1)
    const paginatedData = moviesAll.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const navigate = useNavigate()

    const fetchMovies = async () => {
        try {
            const response = await axios.get<MovieType[]>(`http://127.0.0.1:8000/get_movies`)
            setMoviesAll(response.data)
            setMovies(response.data)
        } catch (error: any) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    const filterMovies = (movie_name: string) => {
        const filtered = moviesAll.filter((item) => item.title.toLowerCase().includes(movie_name.toLowerCase()))
        setMovies(filtered)
        console.log(movies)
    }

    const handleDelete = async (movie_id: number) => {
        try {
            await axios.post(`http://127.0.0.1:8000/delete_movie?movie_id=${movie_id}`)
            fetchMovies()
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleAdd = async (movie: MovieType | null) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/add_movie`, movie)
            alert(response.status)
            fetchMovies()
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleMovieSearch = async (movie_name: string) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/movie_search?movie_name=${movie_name}`)
            setFindingMovie(response.data)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleSwapRank = async (movie_id: number) => {
        try {
            await axios.post(`http://127.0.0.1:8000/swap-rank?movie_id=${movie_id}`)

            fetchMovies()
        } catch (error: any) {
            console.error('Ошибка при свапе:', error.response?.data?.detail || error.message)
        }
    }

    return (
        <>
            <div className="grid grid-cols-10 gap-x-4">
                <div className="col-span-5">
                    <div className="relative">
                        <img
                            src={
                                selectedYear === '2025'
                                    ? '/assets/images/movies.png'
                                    : selectedYear === '2024'
                                    ? '/assets/images/movies.png'
                                    : 'none'
                            }
                            alt="stars"
                            className="w-full"
                        />
                        <div className="flex flex-col">
                            <div className="absolute bottom-0 w-full pb-8" style={{ fontFamily: 'Staatliches' }}>
                                <h3 className="text-7xl font-bold movieing-wider text-nowrap text-zinc-300">
                                    Best movies and series
                                </h3>
                                <div className="flex gap-x-8">
                                    <h4>Breaking bad</h4>
                                    <h4>Squid game 2</h4>
                                    <h4>Green elephant</h4>
                                    <h4>parasite</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-5 movieing-widest text-primary flex flex-col justify-between gap-y-4">
                    <div className="flex justify-end">
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
                                <TableCell>Movie of the year</TableCell>
                                <TableCell>Parasite</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Series of the year</TableCell>
                                <TableCell>Breaking bad</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Character of thr year</TableCell>
                                <TableCell>Gustavo Fring</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Clip of the year</TableCell>
                                <TableCell>Hands up - Meovv</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div className="flex justify-end pb-8">
                        <button onClick={() => setShowData(!showData)}>
                            {showData ? <ChevronUp /> : <ChevronDown />}
                        </button>
                    </div>
                </div>
            </div>

            {showData && (
                <>
                    <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
                    <div className="grid grid-cols-10 gap-x-6">
                        <div className="col-span-7">
                            <div className="flex justify-between px-2 items-center">
                                <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                                    List of the best movies of this year
                                </h3>
                                <div className="px-5 flex items-center gap-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button
                                                className="text-sm py-1 px-4 font-medium cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-primary"
                                                style={{ fontFamily: 'Roboto' }}
                                            >
                                                Add new movie
                                            </button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Movie search</DialogTitle>
                                                <DialogDescription>
                                                    Type movie name that you want to find
                                                </DialogDescription>
                                            </DialogHeader>

                                            <Label htmlFor="title"></Label>
                                            <div className="relative">
                                                <Input
                                                    id="title"
                                                    placeholder="movie title"
                                                    value={movieName}
                                                    onChange={(e) => setmovieName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleMovieSearch(movieName)
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
                                                    onClick={() => handleMovieSearch(movieName)}
                                                >
                                                    <Search className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {findingMovie && (
                                                <div className="flex flex-col items-center gap-y-2">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500${findingMovie.image}`}
                                                        alt="movie"
                                                        width={'160px'}
                                                        className="rounded-md"
                                                    />
                                                    <h4 className="font-semibold text-xl">
                                                        {findingMovie.original_title}
                                                    </h4>
                                                    <h5 className="text-zinc-400">{findingMovie.genre}</h5>
                                                </div>
                                            )}
                                            <Button
                                                type="button"
                                                className="bg-zinc-900 text-primary"
                                                onClick={() => handleAdd(findingMovie)}
                                            >
                                                Add
                                            </Button>
                                        </DialogContent>
                                    </Dialog>

                                    <button onClick={() => setEditMode(!editMode)}>
                                        <Edit className="w-5" strokeWidth={1} />
                                    </button>
                                </div>
                            </div>
                            <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />
                            <Table>
                                <TableHeader>
                                    <TableHead>#</TableHead>
                                    <TableHead>Описание</TableHead>
                                    <TableHead>Дата выхода</TableHead>
                                    <TableHead>Рейтинги</TableHead>
                                    {editMode && (
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
                                    {paginatedData.map((movie, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{(page - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                                            <TableCell className="">
                                                <div className="flex gap-x-2 items-center">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500${movie.image}`}
                                                        alt="audio"
                                                        className="w-12 rounded-sm"
                                                    />
                                                    <div className="flex flex-col">
                                                        <h4 className="font-medium text-lg text-ellipsis whitespace-nowrap overflow-hidden max-w-[480px]">
                                                            {movie.title} ({movie.original_title})
                                                        </h4>
                                                        <h4 className="font-medium text-zinc-300">{movie.tagline}</h4>
                                                        <h4 className="font-light text-zinc-400">
                                                            Жанр: {movie.genre}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {movie.release_date}, ({movie.country})
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-y-2">
                                                    <div className="bg-gradient-to-bl from-[#002a85] via-[#004cc6] to-[#002185] px-2 rounded-full w-20 text-center font-semibold">
                                                        {movie.rating}
                                                    </div>
                                                    <div className="bg-gradient-to-bl from-cyan-950 via-cyan-700 to-cyan-900 px-2 rounded-full w-20 text-center font-semibold">
                                                        {movie.personal_rating == null ? '???' : movie.personal_rating}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            {editMode && (
                                                <>
                                                    <TableCell>
                                                        <Trash2
                                                            className="text-red-500 hover:text-red-700 cursor-pointer w-4"
                                                            onClick={() => handleDelete(movie.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <ChevronUp
                                                            className="w-5 cursor-pointer"
                                                            onClick={() => handleSwapRank(movie.id)}
                                                        />
                                                        <ChevronDown className="w-5 h-5 cursor-pointer" />
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
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
                        </div>
                    </div>
                </>
            )}

            <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
        </>
    )
}
