import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronUp, Dot, Edit } from 'lucide-react'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { fetchMatches } from '@/api/football'
import type { FootballMatchType } from '@/static/types'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Select, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '../ui/select'
import { useQuery } from '@tanstack/react-query'
import { FootballTotal } from '@/static/localdb'

export default function FootballStatistics() {
    const [showData, setShowData] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedYear, setSelectedYear] = useState('2025')
    const ITEMS_PER_PAGE = 10

    const {
        data: football = [],
        isLoading,
        isError,
        refetch: refetchData,
    } = useQuery<FootballMatchType[]>({
        queryKey: ['football'],
        queryFn: () => fetchMatches(),
        enabled: showData,
        placeholderData: (prev) => prev,
    })

    return (
        <>
            <div className="grid grid-cols-10 gap-x-4">
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-between gap-y-4">
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
                    <div className="flex pb-8">
                        <button
                            onClick={() => {
                                setShowData(!showData), fetchMatches()
                            }}
                        >
                            {showData ? <ChevronUp /> : <ChevronDown />}
                        </button>
                    </div>
                </div>
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
            {showData && (
                <>
                    <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
                    <div className="grid grid-cols-10 gap-x-6 pb-10">
                        <div className="col-span-10">
                            <div className="flex justify-between px-2 items-center">
                                <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                                    Top 10 best matches of this year
                                </h3>
                                <div className="px-5 flex items-center gap-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button
                                                className="text-sm py-1 px-4 font-medium cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-primary"
                                                style={{ fontFamily: 'Roboto' }}
                                            >
                                                Add new match
                                            </button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Match search</DialogTitle>
                                                <DialogDescription>Type match that you want to find</DialogDescription>
                                            </DialogHeader>

                                            <Label htmlFor="title"></Label>
                                        </DialogContent>
                                    </Dialog>

                                    <button onClick={() => setEditMode(!editMode)}>
                                        <Edit className="w-5" strokeWidth={1} />
                                    </button>
                                </div>
                            </div>
                            <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />

                            <Carousel
                                opts={{
                                    align: 'start',
                                    slidesToScroll: 1,
                                }}
                                className="w-full"
                            >
                                <CarouselContent>
                                    {football.map((match, index) => (
                                        <CarouselItem className="basis-1/4">
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Card className="bg-gradient-to-t from-[#001d2ccc] via-transparent to-transparent border-zinc-800 gap-y-2">
                                                        <CardHeader>
                                                            <CardDescription className="flex items-center justify-center">
                                                                {match.tournament} <Dot /> {match.date}
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="flex flex-col gap-y-4 items-center">
                                                                <img
                                                                    src={match.image}
                                                                    alt="audio"
                                                                    className="w-48 rounded-sm object-cover aspect-square"
                                                                />
                                                                <div className="grid grid-cols-10 gap-x-4 items-center">
                                                                    <div className="col-span-4">
                                                                        <div className="flex flex-col items-center gap-y-1">
                                                                            <img
                                                                                src={match.team1.logo}
                                                                                alt="team1"
                                                                                className="h-10"
                                                                            />
                                                                            <h4 className="text-md">
                                                                                {match.team1.name}
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <div className="flex flex-col items-center">
                                                                            <h4 className="font-medium text-2xl text-center">
                                                                                {match.score}
                                                                            </h4>
                                                                            <div className="text-center text-zinc-500 text-[12px] whitespace-nowrap">
                                                                                {match.stage}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-span-4">
                                                                        <div className="flex flex-col items-center gap-y-1">
                                                                            <img
                                                                                src={match.team2.logo}
                                                                                alt="team2"
                                                                                className="h-10"
                                                                            />
                                                                            <h4 className="text-md text-wrap">
                                                                                {match.team2.name}
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader></DialogHeader>
                                                    <div className="flex flex-col gap-y-4 items-center">
                                                        <img
                                                            src={match.image}
                                                            alt="audio"
                                                            className="w-64 rounded-sm object-cover aspect-square"
                                                        />
                                                        <div className="grid grid-cols-10 gap-x-4 items-center">
                                                            <div className="col-span-4">
                                                                <div className="flex flex-col items-center gap-y-1">
                                                                    <img
                                                                        src={match.team1.logo}
                                                                        alt="team1"
                                                                        className="h-10"
                                                                    />
                                                                    <h4 className="text-md">{match.team1.name}</h4>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <div className="flex flex-col items-center">
                                                                    <h4 className="font-medium text-2xl text-center">
                                                                        {match.score}
                                                                    </h4>
                                                                    <div className="text-center text-zinc-500 text-[12px] whitespace-nowrap">
                                                                        {match.stage}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-4">
                                                                <div className="flex flex-col items-center gap-y-1">
                                                                    <img
                                                                        src={match.team2.logo}
                                                                        alt="team2"
                                                                        className="h-10"
                                                                    />
                                                                    <h4 className="text-md text-wrap">
                                                                        {match.team2.name}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    </div>
                </>
            )}
            <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
        </>
    )
}
