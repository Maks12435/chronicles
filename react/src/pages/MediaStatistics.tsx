import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from '@tanstack/react-router'
import MusicStatistics from '@/components/custom/MusicStatistics'
import { Music2 } from 'lucide-react'
import FootballStatistics from '@/components/custom/FootballStatistics'
import ShowStatistics from '@/components/custom/ShowStatistics'

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
            <FootballStatistics />
            <ShowStatistics />
        </>
    )
}


