import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronUp, Edit, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type ArtistType, type TrackType } from '@/static/types'
import {
    Select,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '../../components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { fetchTracks } from '@/api/tracks'
import { currentYear } from '@/store/storage'
import AddSongBox from '@/pages/music/music_add'
import GenresChart from '../../components/custom/charts/genres_chart'
import ArtistChart from '../../components/custom/charts/artists_chart'
import MusicTable from './music_table'
import { useSelectedYearMusic } from '@/store/yearStore'
import { getGenresCount } from '../../components/custom/charts/genres_chart'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

export default function MusicStatistics() {
    const [editMode, setEditMode] = useState(false)
    const {selectedYear, setSelectedYear } = useSelectedYearMusic()

    const {
        data: tracks = [],
        isLoading,
        isError,
        refetch: refetchTracks,
    } = useQuery<TrackType[]>({
        queryKey: ['tracks', selectedYear],
        queryFn: () => fetchTracks(selectedYear),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    })

    const { bestArtist, bestRate, artistsList } = useMemo(() => {
        if (!tracks.length) return { bestArtist: '', bestRate: 0, artistsList: [] }

        const artistRate = tracks.reduce<Record<string, number>>((acc, obj) => {
            acc[obj.artist] = Number(((acc[obj.artist] || 0) + (1 + 1 / obj.rank)).toFixed(2))
            return acc
        }, {})

        const artistsList = Object.entries(artistRate)
            .map(([artist, rate]) => ({ artist, rate }))
            .sort((a, b) => b.rate - a.rate)

        const bestArtist = artistsList[0]?.artist ?? ''
        const bestRate = artistsList[0]?.rate ?? 0

        return { bestArtist, bestRate, artistsList }
    }, [tracks])

    return (
        <div className="container">
            <div className="grid grid-cols-10 gap-x-4 relative pt-6">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-transparent to-transparent pointer-events-none z-20" />
                <div className="col-span-5">
                    <div className="relative">
                        <img
                            src={
                                selectedYear === 2025
                                    ? '/assets/images/chaewon2.webp'
                                    : selectedYear === 2024
                                    ? '/assets/images/chaeyoung.png'
                                    : '/assets/images/Eminem.png'
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
                                    {artistsList.slice(0, 6).map((artist, index) => (
                                        <h4>{artist.artist}</h4>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-center gap-y-4">
                    <div className="flex justify-end">
                        <Select onValueChange={(value) => setSelectedYear(Number(value))}>
                            <SelectTrigger className="border-none bg-transparent [&>svg]:hidden">
                                <SelectValue placeholder="Select the year"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Years</SelectLabel>
                                    {Array.from({length: currentYear - 2021}, (_, i) => 2022 + i).map((year) => (
										<SelectItem value={String(year)}>{year}</SelectItem>
									))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Table>
                        <TableBody className="text-md">
                            <TableRow>
                                <TableCell className="flex gap-x-1">
                                    <p>Artist of the Year</p>
                                </TableCell>
                                <TableCell>
                                    {bestArtist} ({bestRate} point)
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="flex gap-x-1">
                                    <p>The song of the year</p>
                                </TableCell>
                                <TableCell>
                                    {tracks[0]?.title} - {tracks[0]?.artist}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="flex gap-x-1">
                                    <p>The best new artist of the year</p>
                                </TableCell>
                                <TableCell>Meovv</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="flex gap-x-1">
                                    <p>Clip of the year</p>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Separator className="h-[1px] bg-zinc-600" />

            <div className="grid grid-cols-10 gap-x-6 pt-4">
                <div className="col-span-7">
                    <div className="flex justify-between px-2 items-center">
                        <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                            Top 30 best songs of this year
                        </h3>
                        <div className="px-2 flex items-center gap-x-2">
                            <AddSongBox refetchTracks={refetchTracks} />
                            <button
                                onClick={() => setEditMode(!editMode)}
                                disabled={currentYear > selectedYear}
                            >
                                <Edit
                                    className={currentYear > selectedYear ? 'w-5 text-zinc-500' : 'w-5'}
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
                            <Button onClick={() => refetchTracks()} variant={'custom'} className="max-w-48">
                                Retry
                            </Button>
                        </div>
                    )}

                    {!isLoading && !isError && (
                        <MusicTable refreshData={refetchTracks} editMode={editMode} tracks={tracks} />
                    )}
                </div>
                <div className="col-span-3">
                    <h3 className="text-lg leading-tight px-4 py-1" style={{ fontFamily: 'Staatliches' }}>
                        Diagram data
                    </h3>
                    <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />

                    <div className="flex flex-col gap-y-4">
                        <GenresChart genres={getGenresCount(tracks)} />
                        <ArtistChart data={tracks} />
                    </div>
                </div>
            </div>
        </div>
    )
}
