import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Edit, Music2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

const data = [
    {
        title: 'Зачем я это делал?',
        description:
            'Диплом был сдан не на тот результат что я ожидал, спасибо жабе сидевшей в комиссии, тем не менее проект сдан успешно.',
        status: 'completed',
        date: '02.06.2025',
    },
    {
        title: 'Зачем я это делал?',
        description:
            'Диплом был сдан не на тот результат что я ожидал, спасибо жабе сидевшей в комиссии, тем не менее проект сдан успешно.',
        status: 'failed',
        date: '02.06.2025',
    },
    {
        title: 'Зачем я это делал?',
        description:
            'Диплом был сдан не на тот результат что я ожидал, спасибо жабе сидевшей в комиссии, тем не менее проект сдан успешно.',
        status: 'completed',
        date: '02.06.2025',
    },
    {
        title: 'Зачем я это делал?',
        description:
            'Диплом был сдан не на тот результат что я ожидал, спасибо жабе сидевшей в комиссии, тем не менее проект сдан успешно.',
        status: 'in progress',
        date: '02.06.2025',
    },
]

export default function TaskStatistics() {
    const now = new Date()
    const currentYear = now.getFullYear()

    const navigate = useNavigate()

    return (
        <>
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Raleway, sans-serif' }}>
                        Task Statistics ({currentYear})
                    </h2>
                    <h3 className="text-lg font-medium text-zinc-400">All information about Task Statistics</h3>
                </div>
                <Button className="bg-zinc-800 text-primary" onClick={() => navigate({to: '/statistics/media'})}>
                    <Music2 />
                    Media statistics
                </Button>
            </div>
            <Separator className="h-[1px] bg-zinc-600 my-2 mb-4" />
            <div className="grid grid-cols-10 gap-x-4">
                <div className="col-span-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Task and achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-y-2">
                                {data.map((item, index) => (
                                    <Task key={index} {...item} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Task and achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-y-2">
                                {data.map((item, index) => (
                                    <Task key={index} {...item} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

function Task({
    title,
    description,
    status,
    date,
}: {
    title: string
    description: string
    status: string
    date: string
}) {
    return (
        <Card className=" py-4">
            <CardContent className="px-4">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3>{title}</h3>
                        <Edit strokeWidth={1} width={20} />
                    </div>
                    <CardDescription className="py-4">{description}</CardDescription>
                    <div className="flex justify-between items-center">
                        {status === 'completed' ? (
                            <div
                                className="rounded-full w-[26%] text-center bg-emerald-200 border-1 text-emerald-900 border-emerald-900 text-sm font-semibold"
                                style={{ fontFamily: 'Roboto' }}
                            >
                                {status}
                            </div>
                        ) : status === 'failed' ? (
                            <div
                                className="rounded-full w-[26%] text-center bg-red-200 border-1 text-red-900 border-red-900 text-sm font-semibold"
                                style={{ fontFamily: 'Roboto' }}
                            >
                                {status}
                            </div>
                        ) : (
                            <div
                                className="rounded-full w-[26%] text-center bg-cyan-200 border-1 text-cyan-900 border-cyan-900 text-sm font-semibold"
                                style={{ fontFamily: 'Roboto' }}
                            >
                                {status}
                            </div>
                        )}
                        <h4 className="text-primary text-sm">{date}</h4>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


