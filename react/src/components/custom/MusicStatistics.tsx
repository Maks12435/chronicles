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
import { ChevronDown, ChevronUp, Clock, Edit, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import type { TrackType } from '@/static/types'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination'

const COLORS = ['rgb(3, 71, 134)', 'rgb(21, 85, 176)', 'rgb(79, 132, 205)', 'rgb(129, 160, 204)']

export default function MusicStatistics() {
    const [showData, setShowData] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [rows, setRows] = useState<TrackType[]>([])
    const [findingTrack, setFindingTrack] = useState<TrackType | null>(null)
    const [trackName, setTrackName] = useState('')
    const [genresCount, setGenresCount] = useState([])
    const [artistsCount, setArtistsCount] = useState([])

    const ITEMS_PER_PAGE = 10
    const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE)
    const [page, setPage] = useState(1)
    const paginatedData = rows.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const fetchTracks = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/get_tracks`)
            setRows(response.data)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const fetchGenresCount = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/get_genres`)
            setGenresCount(response.data)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const fetchArtistsCount = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/get_artists`)
            setArtistsCount(response.data)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        fetchTracks()
        fetchGenresCount()
        fetchArtistsCount()
    }, [])

    const handleDelete = async (track_id: number) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/delete_track?track_id=${track_id}`)
            fetchTracks()
            fetchGenresCount()
            fetchArtistsCount()
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleAdd = async (track: TrackType | null) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/add_track`, track)
            alert(response.status)
            fetchTracks()
            fetchGenresCount()
            fetchArtistsCount()
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleTrackSearch = async (track_name: string) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/music_search?track_name=${track_name}`)
            setFindingTrack(response.data)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return (
        <>
            <div className="grid grid-cols-10 gap-x-4">
                <div className="col-span-5">
                    <div className="relative">
                        <img src="/assets/images/chaewon2.png" alt="stars" className="w-full" />
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
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-between gap-y-4 pt-20">
                    <Table>
                        <TableBody className="text-md">
                            <TableRow>
                                <TableCell>Artist of the Year</TableCell>
                                <TableCell>Le Sserafim</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>The song of the yaer</TableCell>
                                <TableCell>HOT - Le Sserafim</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>The best new artist of the year</TableCell>
                                <TableCell>Meovv</TableCell>
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
                                    Top 20 best songs of this year
                                </h3>
                                <div className="px-5 flex items-center gap-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button
                                                className="text-sm py-1 px-4 font-medium cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-primary"
                                                style={{ fontFamily: 'Roboto' }}
                                            >
                                                Add new song
                                            </button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Song search</DialogTitle>
                                                <DialogDescription>
                                                    Type song name that you want to find
                                                </DialogDescription>
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

                                            <Button
                                                type="button"
                                                className="bg-zinc-900 text-primary"
                                                onClick={() => handleAdd(findingTrack)}
                                            >
                                                Add
                                            </Button>

                                            {findingTrack && (
                                                <div className="flex flex-col items-center">
                                                    <img
                                                        src={findingTrack.image}
                                                        alt="track"
                                                        width={96}
                                                        className="rounded-md"
                                                    />
                                                    <h4 className="font-semibold text-xl">{findingTrack.title}</h4>
                                                    <h5 className="text-zinc-400">{findingTrack.artist}</h5>
                                                </div>
                                            )}
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
                                    <TableHead>Название</TableHead>
                                    <TableHead>Альбом</TableHead>
                                    <TableHead>Дата добавления</TableHead>
                                    <TableHead>
                                        <div className="flex justify-center items-center">
                                            <Clock className="w-4" />
                                        </div>
                                    </TableHead>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.map((song, index) => (
                                        <TableRow key={index}>
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
                                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                                            onClick={() => handleDelete(song.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <ChevronUp className="w-5 cursor-pointer" />
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
                                            label={({ x, y, width, height, index }) => {
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
