import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Edit, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type TrackType } from '@/store/types'
import { useQuery } from '@tanstack/react-query'
import { fetchTracks } from '@/api/tracks'
import { currentYear } from '@/store/global-variables'
import AddSongBox from '@/pages/music/music_add'
import GenresChart from '../../components/custom/charts/genres_chart'
import ArtistChart from '../../components/custom/charts/artists_chart'
import MusicTable from './music_table'
import { useSelectedYearMusic } from '@/store/global-variables'
import { getGenresCount } from '../../components/custom/charts/genres_chart'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'
import Banner, { YearSelection, type BannerConfig } from '@/components/custom/main/interests/header'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription } from '@/components/ui/dialog'

export default function MusicStatistics() {
    const [editMode, setEditMode] = useState(false)
    const { selectedYear, setSelectedYear } = useSelectedYearMusic()

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

    const { bestArtist, bestRate, artistsList, artistRate } = useMemo(() => {
        if (!tracks.length) return { bestArtist: '', bestRate: 0, artistsList: [], artistRate: {} }

        const artistRate = tracks.reduce<Record<string, number>>((acc, obj) => {
            acc[obj.artist] = Number(((acc[obj.artist] || 0) + (1 + 1 / obj.rank)).toFixed(2))
            return acc
        }, {})

        const artistsList = Object.entries(artistRate)
            .map(([artist, rate]) => ({ artist, rate }))
            .sort((a, b) => b.rate - a.rate)

        const bestArtist = artistsList[0]?.artist ?? ''
        const bestRate = artistsList[0]?.rate ?? 0

        return { bestArtist, bestRate, artistsList, artistRate }
    }, [tracks])

    const musicBannerConfig: BannerConfig = {
        title: 'Best artists and music',
        imagesByYear: {
            2025: '/assets/images/chaewon2.webp',
            2024: '/assets/images/chaeyoung.png',
            default: '/assets/images/Eminem.png',
        },
        items: artistsList.map((a) => a.artist),
    }

    return (
        <div className="container">
            <div className="grid grid-cols-10 gap-x-4 relative pt-6">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-transparent to-transparent pointer-events-none z-20" />
                <div className="col-span-5">
                    <Banner year={selectedYear} config={musicBannerConfig} />
                </div>
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-center gap-y-4">
                    <Table>
                        <TableBody className="text-md">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <TableRow>
                                        <TableCell className="flex gap-x-1">
                                            <p>Artist of the Year</p>
                                        </TableCell>
                                        <TableCell>
                                            {bestArtist} ({bestRate} point)
                                        </TableCell>{' '}
                                    </TableRow>
                                </DialogTrigger>
                                <DialogContent>
                                    <div className="gap-0">
                                        <DialogHeader>Top 10 best artists of the {selectedYear} year</DialogHeader>
                                        <DialogDescription>
                                            point are credited based on rank and number of tracks
                                        </DialogDescription>
                                    </div>
                                    {Object.entries(artistRate)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 10)
                                        .map(([artist, rate]) => (
                                            <div key={artist} className="flex justify-between">
                                                <p>{artist}</p>
                                                <p>{rate} points</p>
                                            </div>
                                        ))}
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <TableRow>
                                        <TableCell className="flex gap-x-1">
                                            <p>The song of the year</p>
                                        </TableCell>
                                        <TableCell>
                                            {tracks[0]?.title} - {tracks[0]?.artist}
                                        </TableCell>
                                    </TableRow>
                                </DialogTrigger>
                                <DialogContent>
                                    <div className="flex flex-col items-center p-4">
                                        <img
                                            src={tracks[0]?.mid_image}
                                            alt="track"
                                            className="rounded-md w-[140px]"
                                        />
                                        <h4 className="font-semibold text-xl">{tracks[0]?.title}</h4>
                                        <h5 className="text-zinc-400">{tracks[0]?.artist}</h5>
                                    </div>
                                </DialogContent>
                            </Dialog>

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
                                <TableCell>Aespa - Rich Man</TableCell>
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
                            <YearSelection setSelectedYear={setSelectedYear} />
                            <AddSongBox refetchTracks={refetchTracks} />
                            <button onClick={() => setEditMode(!editMode)} disabled={currentYear > selectedYear}>
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
                        <GenresChart genres={getGenresCount(tracks)} colorScheme={'red'} />
                        <ArtistChart data={tracks} />
                    </div>
                </div>
            </div>
        </div>
    )
}
