import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { LeagueTableType } from '@/static/types'
import {
    Select,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '../../components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function LeagueTable({
    table,
    setLeague,
}: {
    table: LeagueTableType[]
    setLeague: (value: string) => void
}) {
    return (
        <>
            <div className="flex justify-between px-2 items-center pt-10">
                <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                    League Table
                </h3>
                <div className="flex items-center gap-x-2">
                    <Select onValueChange={(value) => setLeague(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="select league"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Leagues</SelectLabel>
                                <SelectItem value="ucl"><div className="flex gap-x-2"><p>Champions league</p>
								<img src="https://res.cloudinary.com/dz7p5nd9x/image/upload/v1760078128/champions-league-logo-png-uefa-champions-league-logo-png-white-11562854628nhnxjr3ofn_bhg3nk.png" alt="ucl" className='w-12 h-12'/></div></SelectItem>
                                <SelectItem value="premier-league">Premier league</SelectItem>
                                <SelectItem value="la-liga">La Liga</SelectItem>
                                <SelectItem value="seria-a">Seria A</SelectItem>
                                <SelectItem value="bundesliga">Bundesliga</SelectItem>
                                <SelectItem value="rfpl">RFPL</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />
            <div className="px-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead className="w-[30%]">Team</TableHead>
                            <TableHead className="text-center">Tour</TableHead>
                            <TableHead className="text-center">Won</TableHead>
                            <TableHead className="text-center">Draw</TableHead>
                            <TableHead className="text-center">Lose</TableHead>
                            <TableHead className="text-center">Scored</TableHead>
                            <TableHead className="text-center">Conceded</TableHead>
                            <TableHead className="text-center font-extrabold">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.map((item, index) => (
                            <TableRow>
                                <TableCell>{item.number}</TableCell>
                                <TableCell>{item.team}</TableCell>
                                <TableCell className="text-center">{item.tour}</TableCell>
                                <TableCell className="text-center">{item.won}</TableCell>
                                <TableCell className="text-center">{item.draw}</TableCell>
                                <TableCell className="text-center">{item.lose}</TableCell>
                                <TableCell className="text-center">{item.scored}</TableCell>
                                <TableCell className="text-center">{item.conceded}</TableCell>
                                <TableCell className="text-center font-extrabold">{item.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
