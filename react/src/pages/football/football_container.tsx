import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronUp, Edit, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchMatches, fetchTable } from '@/api/football'
import type { LeagueTableType, FootballMatchType } from '@/static/types'
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
import { FootballTotal } from '@/static/localdb'
import MatchesCarousel from './matches_carousel'
import { Button } from '@/components/ui/button'
import LeagueTable from './league_table'

export default function FootballStatistics() {
    const [editMode, setEditMode] = useState(false)
    const [selectedYear, setSelectedYear] = useState('2025')
    const [league, setLeague] = useState('la-liga')

    const {
        data: matches = [],
        isLoading,
        isError,
        refetch: refetchMatches,
    } = useQuery<FootballMatchType[]>({
        queryKey: ['football'],
        queryFn: () => fetchMatches(),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })

    const {
        data: table = [],
        isLoading: tableLoading,
        isError: tableError,
        refetch: refetchTableData,
    } = useQuery<LeagueTableType[]>({
        queryKey: ['league_table', league],
        queryFn: () => fetchTable(league),
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })

    return (
        <div className="container">
            <div className="grid grid-cols-10 gap-x-4 relative pt-6">
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-center gap-y-4">
                    <div className="flex">
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
                                <TableCell>Team of the season</TableCell>
                                <TableCell>{FootballTotal[selectedYear].team}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Player of the season</TableCell>
                                <TableCell>{FootballTotal[selectedYear].player}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Coach of the season</TableCell>
                                <TableCell>{FootballTotal[selectedYear].coach}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Match of the season</TableCell>
                                <TableCell>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: FootballTotal['2025'].match.replace(/\n/g, '<br />'),
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-transparent to-transparent pointer-events-none z-20" />
                <div className="col-span-5">
                    <div className="relative">
                        <img
                            src={
                                selectedYear === '2025'
                                    ? '/assets/images/football.webp'
                                    : selectedYear === '2024'
                                    ? '/assets/images/football2.webp'
                                    : 'none'
                            }
                            alt="stars"
                            className="w-full"
                        />

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
            <Separator className="h-[1px] bg-zinc-600" />

            <div className="grid grid-cols-10 gap-x-6 pb-10 mt-4">
                <div className="col-span-10">
                    <div className="flex justify-between px-2 items-center">
                        <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                            Top 10 best matches of this year
                        </h3>
                        <div className="flex items-center gap-x-2">
                            <button onClick={() => setEditMode(!editMode)}>
                                <Edit className="w-5" strokeWidth={1} />
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
                            <Button onClick={() => refetchMatches()} variant={'custom'} className="max-w-48">
                                Retry
                            </Button>
                        </div>
                    )}

                    {!isLoading && !isError && <MatchesCarousel matches={matches} />}
					<LeagueTable table={table} setLeague={setLeague} />
                </div>
            </div>
        </div>
    )
}
