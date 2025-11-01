import MainPieChart from '@/components/custom/charts/main_piechart'
import YearCalendar from '@/components/custom/charts/yaer_calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useUser } from '@/store/userInfo'
import {
    Book,
    CalendarDays,
    Check,
    CircleX,
    Edit,
    Film,
    Laptop,
    Loader2,
    Medal,
    MoveIcon,
    Music,
    Music2,
    Smartphone,
    Timer,
    Tv,
} from 'lucide-react'

export default function Profile() {
    const { user } = useUser()

    return (
        <div
            className="flex justify-center items-center w-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/background.jpg')" }}
        >
            <div className="container py-8">
                <div className="grid grid-cols-10 gap-x-2">
                    <div className="col-span-3 flex">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-end">
                                    <Edit className="aspect-square w-5" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src="assets/images/Epicurus.png"
                                    className="rounded-full aspect-square border border-blue-700"
                                />
                                <h2 className="text-center text-3xl font-medium">{user?.username}</h2>
                                <h3 className="text-center text-lg font-medium text-zinc-500">Admin</h3>

                                <div className="flex flex-col gap-y-4 pt-4">
                                    <Button variant={'custom'}>overall statistcs</Button>
                                    <Button variant={'custom'}>media statistcs</Button>
                                    <Button variant={'custom'}>physical statistcs</Button>
                                    <Button variant={'custom'}>tasks</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-7">
                        <div className="grid grid-cols-10 gap-x-2 gap-y-4">
                            <div className="col-span-4 flex">
                                <YearStatistics />
                            </div>
                            <div className="col-span-6 flex">
                                <YearChart />
                            </div>
                            <div className="col-span-10">
                                <YearCalendar />
                            </div>
                        </div>
                    </div>
                </div>

               
            </div>
        </div>
    )
}

function YearChart() {
    return (
        <Card>
            <CardHeader>Chart statistics about me for this year</CardHeader>
            <CardContent>
                <div className="flex flex-col gap-y-4">
                    <div className="grid grid-cols-4">
                        <div className="flex flex-col gap-y-2">
                            <MainPieChart percentage={67} size={5} />
                            <h5 className="text-center text-zinc-400">Physical</h5>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <MainPieChart percentage={97} size={5} />
                            <h5 className="text-center text-zinc-400">Educational</h5>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <MainPieChart percentage={88} size={5} />
                            <h5 className="text-center text-zinc-400">self-dev</h5>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <MainPieChart percentage={91} size={5} />
                            <h5 className="text-center text-zinc-400">self-dev</h5>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 pt-4">
                        <div className="flex flex-col gap-y-2">
                            <MainPieChart percentage={79} size={10} />
                            <h5 className="text-center text-zinc-400">Physical</h5>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <MainPieChart percentage={99} size={10} />
                            <h5 className="text-center text-zinc-400">Educational</h5>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function YearStatistics() {
    return (
        <Card>
            <CardHeader>Statistics about me for this year</CardHeader>
            <CardContent>
                <div className="flex gap-x-2 items-center">
                    <Music className="aspect-square w-4 text-zinc-100"></Music>
                    <h4 className="text-zinc-400">favorite song: Godzilla</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Music2 className="aspect-square w-4 text-zinc-100"></Music2>
                    <h4 className="text-zinc-400">favorite artist: Eminem</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Film className="aspect-square w-4 text-zinc-100"></Film>
                    <h4 className="text-zinc-400">best movie: Parasite</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Tv className="aspect-square w-4 text-zinc-100"></Tv>
                    <h4 className="text-zinc-400">best tv show: Breaking bad</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Check className="aspect-square w-4" />
                    <h4 className="text-zinc-400">completed tasks: 24</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <CircleX className="aspect-square w-4" />
                    <h4 className="text-zinc-400">failed tasks: 5</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Loader2 className="aspect-square w-4 animate-spin" />
                    <h4 className="text-zinc-400">tasks in progress: 2</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Book className="aspect-square w-4" />
                    <h4 className="text-zinc-400">readen books count: 2</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Timer className="aspect-square w-4" />
                    <h4 className="text-zinc-400">time in site: 3465min</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Medal className="aspect-square w-4" />
                    <h4 className="text-zinc-400">achievement of the year: Diploma</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <CalendarDays className="aspect-square w-4" />
                    <h4 className="text-zinc-400">event of the year: Diploma</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <CircleX className="aspect-square w-4" />
                    <h4 className="text-zinc-400">failure of the year: don't pass MMC</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Smartphone className="aspect-square w-4" />
                    <h4 className="text-zinc-400">Smartphone usage: 897h</h4>
                </div>
                <div className="flex gap-x-2 items-center">
                    <Laptop className="aspect-square w-4" />
                    <h4 className="text-zinc-400">laptop usage: 1197h</h4>
                </div>
            </CardContent>
        </Card>
    )
}
