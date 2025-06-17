import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { useNavigate } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, Clock, Clock1, Edit, Edit2, Music2, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import type { TrackType } from '@/static/types'

let data = [
    {
        title: 'Feel Special',
        artist: 'Twice',
        image: '/assets/images/audio/fs.png',
        album: 'Feel Special',
        date: '16 декабря 2025 г.',
        duration: '3:33',
    },
    {
        title: 'Fancy',
        artist: 'Twice',
        image: '/assets/images/audio/fancy.jpg',
        album: 'FANCY YOU',
        date: '21 мая 2021 г.',
        duration: '2:44',
    },
    {
        title: 'Likey',
        artist: 'Twice',
        image: '/assets/images/audio/likey.jpg',
        album: 'Twicetagram',
        date: '19 августа 2022 г.',
        duration: '3:06',
    },
    {
        title: 'Knock knock',
        artist: 'Twice',
        image: '/assets/images/audio/KK.jpeg',
        album: 'Twicecoaster',
        date: '24 февраля 2023 г.',
        duration: '2:53',
    },
]

const piedata = [
    { name: 'Pop', value: 400 },
    { name: 'K-Pop', value: 300 },
    { name: 'Rock', value: 200 },
    { name: 'Jazz', value: 100 },
]

const COLORS = ['rgb(3, 134, 71)', 'rgb(21, 176, 85)', 'rgb(79, 205, 132)', 'rgb(129, 204, 160)']

export default function MediaStatistics() {
    const now = new Date()
    const currentYear = now.getFullYear()

    const navigate = useNavigate()

    return (
        <>
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Raleway, sans-serif' }}>
                        Media Statistics ({currentYear})
                    </h2>
                    <h3 className="text-lg font-medium text-zinc-400">Media tables and tops of media content</h3>
                </div>
                <Button className="bg-zinc-800 text-primary" onClick={() => navigate({ to: '/statistics/tasks' })}>
                    <Music2 />
                    Tasks statistics
                </Button>
            </div>
            <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
            <MusicStatistics />

            <div className="grid grid-cols-10 gap-x-4">
                <div
                    className="col-span-5 tracking-wider text-primary pt-20 flex flex-col gap-y-4"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                    <h4 className="font-medium text-2xl">Artist of the Year: Le Sserafim</h4>
                    <h4 className="font-medium text-2xl">The song of the yaer: HOT - Le Sserafim</h4>
                    <h4 className="font-medium text-2xl">The best new artist of the year: Meovv</h4>
                    <h4 className="font-medium text-2xl">Artist of the Year: Le Sserafim</h4>
                </div>
                <div className="col-span-5">
                    <div className="relative">
                        <img src="/assets/images/footballers.png" alt="stars" className="w-full" />
                        <div className="flex flex-col">
                            <div className="absolute bottom-0 w-full pb-8" style={{ fontFamily: 'Staatliches' }}>
                                <h3
                                    className="text-7xl font-bold tracking-wider text-nowrap text-zinc-300 absolute right-0 bottom-14"
                                    style={{
                                        fontFamily: 'Staatliches',
                                    }}
                                >
                                    the best in football this season
                                </h3>
                                <div className="flex gap-x-8 justify-end">
                                    <h4>Barcelona</h4>
                                    <h4>PSG</h4>
                                    <h4>Liverpool</h4>
                                    <h4>Inter</h4>
                                    <h4>Bayren</h4>
                                    <h4>Arsenal</h4>
                                    <h4>Real Madrid</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
            <div className="grid grid-cols-10 gap-x-4">
                <div className="col-span-5">
                    <div className="relative">
                        <img src="/assets/images/movies.png" alt="stars" className="w-full" />
                        <div className="flex flex-col">
                            <div className="absolute bottom-0 w-full pb-8" style={{ fontFamily: 'Staatliches' }}>
                                <h3 className="text-7xl font-bold tracking-wider text-nowrap text-zinc-300">
                                    Best movies and best series
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
                <div
                    className="col-span-4 tracking-wider text-primary pt-20 flex flex-col gap-y-4"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                    <h4 className="font-medium text-2xl">Artist of the Year: Le Sserafim</h4>
                    <h4 className="font-medium text-2xl">The song of the yaer: HOT - Le Sserafim</h4>
                    <h4 className="font-medium text-2xl">The best new artist of the year: Meovv</h4>
                    <h4 className="font-medium text-2xl">Artist of the Year: Le Sserafim</h4>
                </div>
            </div>

            {/* 
            <div className="grid grid-cols-10 gap-x-4 items-center">
                <div className="col-span-4 z-10" style={{ fontFamily: 'Staatliches' }}>
                    <h2 className="text-8xl text-zinc-300 text-nowrap">Media statistics</h2>
                    <h3 className="text-4xl text-zinc-400">June 2025</h3>
                    <h4>
                        if he hadn't overslept, he would has been on time at the meeting He asked, why I hadn't answered
                        to his letter earlier As soon as he began to talk, he was immediately interupted I would prefer
                        you don't mention about that at the meeting She must be has already left, there is no her coat
                        on the hanger Despite being tired, he continued to work We wish that the project will be
                        finished by the end of this month He acts like he knows everything in this world It was the
                        first place that I had visited abroad Being understandable is more important than speaking ideal
                    </h4>
                </div>
                <div className="col-span-6 z-0">
                    <img src="/assets/images/stars2.png" alt="stars" className="w-full" />
                </div>
            </div> */}
        </>
    )
}

function MusicStatistics() {
    const [showData, setShowData] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [rows, setRows] = useState(data)
    const [findingTrack, setFindingTrack] = useState<TrackType | null>(null)
    const [trackName, setTrackName] = useState('')

    const handleDelete = (title: string) => {
        setRows((prev) => prev.filter((row) => row.title !== title))
    }

    const handleAdd = () => {
        if (findingTrack) {
            setRows((prev) => [...prev, findingTrack])
            setFindingTrack(null) 
            setTrackName('') 
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
                    <div className="grid grid-cols-10 gap-x-2">
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
                                                onClick={() => handleAdd()}
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
                                    {rows.map((song, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
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
                                                <TableCell>
                                                    <Trash2
                                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                                        onClick={() => handleDelete(song.title)}
                                                    />
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="col-span-3">
                            <div className="p-2 flex justify-end"></div>
                            <Card>
                                <div className="w-full h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={piedata}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius="70%"
                                                outerRadius="100%"
                                                paddingAngle={0}
                                                stroke="none"
                                            >
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Legend
                                                layout="vertical"
                                                verticalAlign="middle"
                                                align="right"
                                                iconType="square"
                                                wrapperStyle={{
                                                    lineHeight: '42px',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card>
                                <div className="w-full h-[220px] rounded-2xl shadow">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={piedata}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius="70%"
                                                outerRadius="100%"
                                                paddingAngle={0}
                                                stroke="none"
                                            >
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Legend
                                                layout="vertical"
                                                verticalAlign="middle"
                                                align="right"
                                                iconType="square"
                                                wrapperStyle={{
                                                    lineHeight: '42px',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </div>
                </>
            )}

            <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
        </>
    )
}
