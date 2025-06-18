import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from '@tanstack/react-router'
import MusicStatistics from '@/components/custom/MusicStatistics'
import { Music2 } from 'lucide-react'

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
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-between gap-y-4 pt-20">
                    <Table>
                        <TableBody className="text-md">
                            <TableRow>
                                <TableCell>Team of the season</TableCell>
                                <TableCell>Barcelona</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Player of the season</TableCell>
                                <TableCell>Raphinia</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Coach of the season</TableCell>
                                <TableCell>Hansi Flick</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Match of the season</TableCell>
                                <TableCell>
                                    Barcelona 3:2 Real Madrid <br />
                                    (Copa del Rey final)
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
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
                <div className="col-span-5 tracking-widest text-primary flex flex-col justify-between gap-y-4 pt-20">
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
                            <TableRow>
                                <TableCell>Clip of the year</TableCell>
                                <TableCell>Hands up - Meovv</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}


