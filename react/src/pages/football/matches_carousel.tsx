import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dot } from 'lucide-react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import type { FootballMatchType } from '@/store/types'

export default function MatchesCarousel( {matches} : {matches: FootballMatchType[]}) {
    return (
        <Carousel
            opts={{
                align: 'start',
                slidesToScroll: 1,
            }}
            className="w-full"
        >
            <CarouselContent>
                {matches.map((match, index) => (
                    <CarouselItem className="basis-1/4" key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 240 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: index * 0.3 }}
                        >
                            <Dialog>
                                <DialogTrigger>
                                    <Card className="bg-gradient-to-t from-[#001d2ccc] via-transparent to-transparent border-zinc-800 gap-y-2 hover:from-[#002d44cc] transition">
                                        <CardHeader>
                                            <CardDescription className="flex items-center justify-center gap-1">
                                                <span className="truncate max-w-[120px] overflow-hidden whitespace-nowrap">
                                                    {match.tournament}
                                                </span>
                                                <Dot />
                                                <span>{match.date}</span>
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
                                                            <img src={match.team1.logo} alt="team1" className="h-10" />
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
                                                            <img src={match.team2.logo} alt="team2" className="h-10" />
                                                            <h4 className="text-md text-wrap">{match.team2.name}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <div className="flex items-center justify-center text-sm text-zinc-400">
                                            {match.tournament} <Dot /> {match.date} <Dot /> {match.stadium}
                                        </div>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-y-4 items-center">
                                        <img
                                            src={match.image}
                                            alt="audio"
                                            className="w-64 rounded-sm object-cover aspect-square"
                                        />
                                        <div className="grid grid-cols-10 gap-x-4 items-center">
                                            <div className="col-span-4">
                                                <div className="flex flex-col items-center gap-y-1">
                                                    <img src={match.team1.logo} alt="team1" className="h-10" />
                                                    <h4 className="text-md">{match.team1.name}</h4>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex flex-col items-center">
                                                    <h4 className="font-medium text-2xl text-center">{match.score}</h4>
                                                    <div className="text-center text-zinc-500 text-[12px] whitespace-nowrap">
                                                        {match.stage}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4">
                                                <div className="flex flex-col items-center gap-y-1">
                                                    <img src={match.team2.logo} alt="team2" className="h-10" />
                                                    <h4 className="text-md text-wrap">{match.team2.name}</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-10 gap-x-4">
                                            <div className="col-span-4">
                                                <div className="flex flex-col items-start">
                                                    {match.team1.goals.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex gap-x-2 text-[12px] text-zinc-400"
                                                        >
                                                            <p>{item.scorer}</p>
                                                            <p>{item.minute}'</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-span-2"></div>
                                            <div className="col-span-4">
                                                <div className="flex flex-col items-end">
                                                    {match.team2.goals.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex gap-x-2 text-[12px] text-zinc-400"
                                                        >
                                                            <p>{item.scorer}</p>
                                                            <p>{item.minute}'</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-x-4">
                                            <Table>
                                                <TableBody className="text-[12px] text-zinc-400">
                                                    <TableRow>
                                                        <TableCell className="text-center">{match.team1.xg}</TableCell>
                                                        <TableCell className="w-54 text-center">XG</TableCell>
                                                        <TableCell className="text-center">{match.team2.xg}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="text-center">
                                                            {match.team1.shots}
                                                        </TableCell>
                                                        <TableCell className="w-54 text-center">Shots</TableCell>
                                                        <TableCell className="text-center">
                                                            {match.team2.shots}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="text-center">
                                                            {match.team1.shots_on_target}
                                                        </TableCell>
                                                        <TableCell className="w-54 text-center">
                                                            Shots on target
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {match.team2.shots_on_target}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="text-center">
                                                            {match.team1.possession}%
                                                        </TableCell>
                                                        <TableCell className="w-54 text-center">Possession</TableCell>
                                                        <TableCell className="text-center">
                                                            {match.team2.possession}%
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
