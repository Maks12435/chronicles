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
import type { TrackType } from '@/static/types'
import type { ArtistCountType } from '@/static/types'
import type { GenresCountType } from '@/static/types'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination'
import { Select, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '../ui/select'
import { BASE_URL } from '@/static/urls'
import { musicTotal } from '@/static/localdb'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { fetchArtistsCount, fetchGenresCount, fetchTracks } from '@/api/tracks'

const COLORS = ['rgb(3, 71, 134)', 'rgb(21, 85, 176)', 'rgb(79, 132, 205)', 'rgb(129, 160, 204)']
const now = new Date()
const currentYear = now.getFullYear()

export default function MusicStatistics() {
    const [showData, setShowData] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedYear, setSelectedYear] = useState<string>('2025')

    const ITEMS_PER_PAGE = 10
    const [page, setPage] = useState(1)

    const {
        data: tracks = [],
        isLoading: tracksLoading,
        isError: tracksError,
        refetch: refetchTracks,
    } = useQuery<TrackType[]>({
        queryKey: ['tracks', selectedYear],
        queryFn: () => fetchTracks(selectedYear),
        enabled: showData,
        placeholderData: (previousData) => previousData,
    })

    const {
        data: genresCount = [],
        isLoading: genresLoading,
        isError: genresError,
        refetch: refetchGenres,
    } = useQuery<GenresCountType[]>({
        queryKey: ['genres', selectedYear],
        queryFn: () => fetchGenresCount(selectedYear),
        enabled: showData,
        placeholderData: (previousData) => previousData,
    })

    const {
        data: artistsCount = [],
        isLoading: artistsLoading,
        isError: artistsError,
        refetch: refetchArtists,
    } = useQuery<ArtistCountType[]>({
        queryKey: ['artists', selectedYear],
        queryFn: () => fetchArtistsCount(selectedYear),
        enabled: showData,
        placeholderData: (previousData) => previousData,
    })

    const refreshData = async () => {
        await Promise.all([refetchTracks(), refetchGenres(), refetchArtists()])
    }

    const handleDelete = async (track_id: number) => {
        try {
            await axios.post(`${BASE_URL}/delete_track?track_id=${track_id}`)
            await refreshData()
            toast.success('Трек успешно удален')
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleSwapRankNext = async (track_id: number) => {
        try {
            await axios.post(`${BASE_URL}/swap_rank_next?track_id=${track_id}`)
            await refreshData()
        } catch (error: any) {
            console.error('Ошибка при свапе:', error.response?.data?.detail || error.message)
        }
    }

    const handleSwapRankPrevious = async (track_id: number) => {
        try {
            await axios.post(`${BASE_URL}/swap_rank_previous?track_id=${track_id}`)
            await refreshData()
        } catch (error: any) {
            console.error('Ошибка при свапе:', error.response?.data?.detail || error.message)
        }
    }

    const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE)
    const paginatedData = tracks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <>
            <div className="grid grid-cols-10 gap-x-4">
                <div className="col-span-5">
                    <div className="relative">
                        <img
                            src={
                                selectedYear === '2025'
                                    ? '/assets/images/chaewon2.webp'
                                    : selectedYear === '2024'
                                    ? '/assets/images/chaeyoung.webp'
                                    : 'none'
                            }
                            alt="stars"
                            className="w-full"
                        />
                        <div className="flex flex-col">
                            <div className="absolute bottom-0 w-full pb-8" style={{ fontFamily: 'Staatliches' }}>
                                <h3 className="text-7xl font-bold tracking-wider text-nowrap text-zinc-300">
                                    Best artists and music
                                </h3>
                                <div className="flex gap-x-8">
                                    <h4>Le Sserafim</h4>
                                    <h4>Twice</h4>
                                    <h4>Babymonster</h4>
                                    <h4>Clean Bandit</h4>
                                    <h4>Zivert</h4>
                                    <h4>I-dle</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-between gap-y-4">
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
                                <TableCell>Artist of the Year</TableCell>
                                <TableCell>{musicTotal[selectedYear].artist}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>The song of the yaer</TableCell>
                                <TableCell>{musicTotal[selectedYear].song}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>The best new artist of the year</TableCell>
                                <TableCell>{musicTotal[selectedYear].new_artist}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Clip of the year</TableCell>
                                <TableCell>{musicTotal[selectedYear].clip}</TableCell>
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
                                    Top 30 best songs of this year
                                </h3>
                                <div className="px-2 flex items-center gap-x-2">
                                    <AddSongBox selectedYear={selectedYear} refreshData={refreshData} />
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        disabled={currentYear > parseInt(selectedYear)}
                                    >
                                        <Edit className={currentYear > parseInt(selectedYear) ? 'w-5 text-zinc-500' : 'w-5'} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>

                            <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />

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
                                    {paginatedData.map((song, index) => (
                                        <motion.tr
                                            key={song.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.14 }}
                                        >
                                            <TableCell>{(page - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-x-2 items-center">
                                                    <img src={song.image} alt="audio" className="w-12 rounded-sm" />
                                                    <div className="flex flex-col">
                                                        <h4 className="font-medium text-lg">{song.title}</h4>
                                                        <h4 className="font-medium text-zinc-400">{song.artist}</h4>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{song.album}</TableCell>
                                            <TableCell>{song.date}</TableCell>
                                            <TableCell className="text-center">{song.duration}</TableCell>
                                            {editMode && (
                                                <>
                                                    <TableCell>
                                                        <Trash2
                                                            className="text-red-500 hover:text-red-700 cursor-pointer w-4"
                                                            onClick={() => handleDelete(song.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <ChevronUp
                                                            className="w-5 cursor-pointer"
                                                            onClick={() => handleSwapRankNext(song.id)}
                                                        />
                                                        <ChevronDown
                                                            className="w-5 h-5 cursor-pointer"
                                                            onClick={() => handleSwapRankPrevious(song.id)}
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
                        </div>
                        <div className="col-span-3">
                            <h3 className="text-lg leading-tight px-4 py-1" style={{ fontFamily: 'Staatliches' }}>
                                Diagram data
                            </h3>
                            <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />

                            <div className="flex flex-col gap-y-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={genresCount}
                                            dataKey="count"
                                            nameKey="genre"
                                            innerRadius="70%"
                                            outerRadius="100%"
                                            paddingAngle={0}
                                            stroke="none"
                                        >
                                            {genresCount.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                            iconType="square"
                                            wrapperStyle={{
                                                paddingLeft: '12px',
                                                lineHeight: '42px',
                                                fontSize: '12px',
                                                whiteSpace: 'normal',
                                                overflowWrap: 'break-word',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={artistsCount}
                                        layout="vertical"
                                        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                                    >
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="artist" hide /> <Tooltip />
                                        <Bar
                                            dataKey="count"
                                            fill="#8884d8"
                                            radius={[0, 5, 5, 0]}
                                            label={({ x, y, height, index }) => {
                                                const artist = artistsCount[index].artist
                                                return (
                                                    <text
                                                        x={x + 5}
                                                        y={y! + height / 2}
                                                        fill="white"
                                                        fontSize={12}
                                                        alignmentBaseline="middle"
                                                    >
                                                        {artist}
                                                    </text>
                                                )
                                            }}
                                        >
                                            {artistsCount.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
        </>
    )
}

function AddSongBox({ selectedYear, refreshData }: { selectedYear: string; refreshData: (year: string) => void }) {
    const [trackName, setTrackName] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [findingTrack, setFindingTrack] = useState<TrackType | null>(null)

    const handleAdd = async (track: TrackType | null, year: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/add_track?year=${year}`, track)

            refreshData(selectedYear)
            setOpenDialog(false)
            toast.success('Трек успешно добавлен')
        } catch (error: any) {
            if (error.response && error.response.data?.detail) {
                toast.error(error.response.data.detail)
            } else if (error.message) {
                toast.error(error.message)
            } else {
                toast.error(error.message)
            }
        }
    }

    const handleTrackSearch = async (track_name: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/music_search?track_name=${track_name}`)
            setFindingTrack(response.data)
        } catch (error: any) {
            console.log(error.message)
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
                    Add new song
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Song search</DialogTitle>
                    <DialogDescription>Type song name that you want to find</DialogDescription>
                </DialogHeader>

                <Label htmlFor="title"></Label>
                <div className="relative">
                    <Input
                        id="title"
                        placeholder="Song title"
                        value={trackName}
                        onChange={(e) => setTrackName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleTrackSearch(trackName)
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
                        onClick={() => handleTrackSearch(trackName)}
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                {findingTrack && (
                    <div className="flex flex-col items-center p-4">
                        <img src={findingTrack.image} alt="track" className="rounded-md w-[140px]" />
                        <h4 className="font-semibold text-xl">{findingTrack.title}</h4>
                        <h5 className="text-zinc-400">{findingTrack.artist}</h5>
                    </div>
                )}

                <Button
                    type="button"
                    className="bg-zinc-900 text-primary"
                    onClick={() => {
                        if (findingTrack) {
                            handleAdd(findingTrack, selectedYear)
                        }
                    }}
                    disabled={!findingTrack}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    )
}
