import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronUp, Edit, Loader2 } from 'lucide-react'
import type { MovieType, SeriesType } from '@/static/types'
import {
    Select,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '../../components/ui/select'
import { fetchMovies, fetchSeries } from '@/api/shows'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import GenresChart from '../../components/custom/charts/genres_chart'
import AddMovie from './movie_add'
import MovieTable from './movie_table'
import RatingBox from '../../components/custom/charts/average_rating'
import SeriesTable from './series_table'
import AddSeries from './series_add'
import { getGenresCount } from '../../components/custom/charts/genres_chart'
import { getAverageRatings } from '../../components/custom/charts/average_rating'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { currentYear } from '@/store/storage'

export default function ShowContainer() {
    const [editMode, setEditMode] = useState(false)
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [type, setType] = useState('movies')

    const {
        data: movies = [],
        isLoading: moviesLoading,
        isError: moviesError,
        refetch: refetchMovies,
    } = useQuery<MovieType[]>({
        queryKey: ['movies', selectedYear],
        queryFn: () => fetchMovies(selectedYear),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })

    const {
        data: series = [],
        isLoading: seriesLoading,
        isError: seriesError,
        refetch: refetchSeries,
    } = useQuery<SeriesType[]>({
        queryKey: ['series', selectedYear],
        queryFn: () => fetchSeries(selectedYear),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })

    return (
        <div className="container">
            <div className="grid grid-cols-10 gap-x-4 relative pt-6">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-transparent to-transparent pointer-events-none z-20" />
                <div className="col-span-5">
                    <div className="relative">
                        <img
                            src={
                                selectedYear === 2025
                                    ? '/assets/images/movies.png'
                                    : selectedYear === 2024
                                    ? '/assets/images/movies.webp'
                                    : '/assets/images/movies.webp'
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
                <div className="col-span-5 movieing-widest text-primary flex flex-col justify-center gap-y-4">
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
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Separator className="h-[1px] bg-zinc-600" />
            <div className="grid grid-cols-10 gap-x-6 pt-4">
                <div className="col-span-7">
                    <div className="flex justify-between px-2 items-center">
                        <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                            List of the best movies of this year
                        </h3>
                        <div className="px-1 flex items-center gap-x-2 pb-2">
                            {type === 'movies' ? (
                                <AddMovie refetchMovies={refetchMovies} />
                            ) : (
                                <AddSeries refetchSeries={refetchSeries} />
                            )}

                            <Tabs value={type} onValueChange={setType}>
                                <TabsList>
                                    <TabsTrigger
                                        value="movies"
                                    >
                                        Movies
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="series"
                                    >
                                        Series
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <button onClick={() => setEditMode(!editMode)}>
                                <Edit className="w-5" strokeWidth={1} />
                            </button>
                        </div>
                    </div>
                    <Separator className="h-[1px] bg-zinc-800" />

                    {type === 'movies' ? (
                        <>
                            {moviesLoading && (
                                <div className="flex justify-center items-center h-[160px]">
                                    <Loader2 className="w-26 h-26 animate-spin text-zinc-700" />
                                </div>
                            )}

                            {moviesError && (
                                <div className="flex flex-col justify-center items-center h-[200px] gap-y-2">
                                    <p className="text-red-700 text-lg font-semibold">Error during loading data</p>
                                    <Button onClick={() => refetchMovies()} variant={'custom'} className="max-w-48">
                                        Retry
                                    </Button>
                                </div>
                            )}

                            {!moviesLoading && !moviesError && (
                                <MovieTable refreshData={refetchMovies} editMode={editMode} data={movies} type={type} />
                            )}
                        </>
                    ) : (
                        <>
                            {seriesLoading && (
                                <div className="flex justify-center items-center h-[160px]">
                                    <Loader2 className="w-26 h-26 animate-spin text-zinc-700" />
                                </div>
                            )}

                            {seriesError && (
                                <div className="flex flex-col justify-center items-center h-[200px] gap-y-2">
                                    <p className="text-red-700 text-lg font-semibold">Error during loading data</p>
                                    <Button onClick={() => refetchSeries()} variant={'custom'} className="max-w-48">
                                        Retry
                                    </Button>
                                </div>
                            )}

                            {!seriesLoading && !seriesError && (
                                <SeriesTable
                                    refreshData={refetchSeries}
                                    editMode={editMode}
                                    data={series}
                                    type={type}
                                />
                            )}
                        </>
                    )}
                </div>
                <div className="col-span-3">
                    <h3 className="text-lg leading-tight px-4 py-1" style={{ fontFamily: 'Staatliches' }}>
                        Diagram data
                    </h3>
                    <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />

                    <div className="flex flex-col gap-y-4">
                        {type === 'movies' ? (
                            <GenresChart genres={getGenresCount(movies)} />
                        ) : (
                            <GenresChart genres={getGenresCount(series)} />
                        )}
                        {type === 'movies' ? (
                            <RatingBox ratings={getAverageRatings(movies)} />
                        ) : (
                            <RatingBox ratings={getAverageRatings(series)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
