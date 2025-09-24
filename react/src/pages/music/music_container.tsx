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
import { musicTotal } from '@/static/localdb'
import { useQuery } from '@tanstack/react-query'
import { fetchTracks } from '@/api/tracks'
import { currentYear } from '@/store/storage'
import AddSongBox from '@/pages/music/music_add'
import DataCorrectorBox from './correct_main_info'
import { loadYearData } from '@/store/storage'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import GenresChart from '../../components/custom/charts/genres_chart'
import ArtistChart, { getArtistsCount } from '../../components/custom/charts/artists_chart'
import MusicTable from './music_table'
import { useSelectedYearMusic } from '@/store/yearStore'
import { getGenresCount } from '../../components/custom/charts/genres_chart'
import { Button } from '@/components/ui/button'

export default function MusicStatistics() {
    const [editMode, setEditMode] = useState(false)
    const { selectedYear, setSelectedYear } = useSelectedYearMusic()
    const [artist, setArtist] = useState<ArtistType | null>(null)
    const [track, setTrack] = useState<TrackType | null>(null)

    useEffect(() => {
        const { artist, track } = loadYearData(selectedYear)
        setArtist(artist)
        setTrack(track)
    }, [selectedYear])

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

    return (
        <div className='container'>
            <div className="grid grid-cols-10 gap-x-4 relative pt-6">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-transparent to-transparent pointer-events-none z-20" />
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
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-center gap-y-4">
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
                                <TableCell className="flex gap-x-1">
                                    {currentYear <= parseInt(selectedYear) && <DataCorrectorBox type={'artist'} />}
                                    <p>Artist of the Year</p>
                                </TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <TableCell>{artist?.name}</TableCell>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <div className="flex flex-col items-center p-4">
                                            <img src={artist?.image} alt="track" className="rounded-md w-[140px]" />
                                            <h4 className="font-semibold text-xl">{artist?.name}</h4>
                                            <h5 className="text-lg">{artist?.genre}</h5>
                                            <h4 className="text-zinc-400 text-sm">followers: {artist?.followers}</h4>
                                            <h5 className="text-zinc-400 text-sm">popularity: {artist?.popularity}</h5>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableRow>
                            <TableRow>
                                <TableCell className="flex gap-x-1">
                                    {currentYear <= parseInt(selectedYear) && <DataCorrectorBox type={'track'} />}
                                    <p>The song of the year</p>
                                </TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <TableCell>
                                            {track?.title} - {track?.artist}
                                        </TableCell>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <div className="flex flex-col items-center p-4">
                                            <img src={track?.image} alt="track" className="rounded-md w-[140px]" />
                                            <h4 className="font-semibold text-xl">{track?.title}</h4>
                                            <h5 className="text-lg">{track?.artist}</h5>
                                            <h4 className="text-zinc-400 text-sm">Album: {track?.album}</h4>
                                            <h5 className="text-zinc-400 text-sm">{track?.genre}</h5>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableRow>
                            <TableRow>
                                <TableCell className="flex gap-x-1">
                                    {currentYear <= parseInt(selectedYear) && <DataCorrectorBox type={'artist'} />}
                                    <p>The best new artist of the year</p>
                                </TableCell>
                                <TableCell>{musicTotal[selectedYear].new_artist}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="flex gap-x-1">
                                    {currentYear <= parseInt(selectedYear) && <DataCorrectorBox type={'track'} />}
                                    <p>Clip of the year</p>
                                </TableCell>
                                <TableCell>{musicTotal[selectedYear].clip}</TableCell>
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
                                disabled={currentYear > parseInt(selectedYear)}
                            >
                                <Edit
                                    className={currentYear > parseInt(selectedYear) ? 'w-5 text-zinc-500' : 'w-5'}
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
                            <Button
                                onClick={() => refetchTracks()}
                                variant={'custom'}
								className='max-w-48'
                            >
                                Retry
                            </Button>
                        </div>
                    )}

                    {!isLoading && !isError && <MusicTable refreshData={refetchTracks} editMode={editMode} tracks={tracks} />}
                    
                </div>
                <div className="col-span-3">
                    <h3 className="text-lg leading-tight px-4 py-1" style={{ fontFamily: 'Staatliches' }}>
                        Diagram data
                    </h3>
                    <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />

                    <div className="flex flex-col gap-y-4">
                        <GenresChart genres={getGenresCount(tracks)} />
                        <ArtistChart artists={getArtistsCount(tracks)} />
                    </div>
                </div>
            </div>
        </div>
    )
}
