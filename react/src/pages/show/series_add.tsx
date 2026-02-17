import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import type { SeriesType } from '@/store/types'
import { Loader2, Search } from 'lucide-react'
import { handleSeriesAdd, handleSeriesSearch } from '@/api/shows'

export default function AddSeries({ refetchSeries }: { refetchSeries: () => void }) {
    const [seriesName, setSeriesName] = useState('')
    const [findingSeries, setFindingSeries] = useState<SeriesType | null>(null)
    const [season, setSeason] = useState<number>(1)
    const [loading, setLoading] = useState(false)
    const [personalRating, setPersonalRating] = useState(0)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary">Add new series</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Series search</DialogTitle>
                    <DialogDescription>Type series name that you want to find</DialogDescription>
                </DialogHeader>

                <Label htmlFor="title"></Label>
                <div className="flex gap-x-2">
                    <div className="relative w-5/6">
                        <Input
                            id="title"
                            placeholder="tv show title"
                            value={seriesName}
                            onChange={(e) => setSeriesName(e.target.value)}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    const series = await handleSeriesSearch(seriesName, season, setLoading)
                                    setFindingSeries(series)
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
                            onClick={async () => {
                                const series = await handleSeriesSearch(seriesName, season, setLoading)
                                setFindingSeries(series)
                            }}
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="w-1/6">
                        <Input
                            id="season"
                            placeholder="season"
                            type="number"
                            value={season}
                            onChange={(e) => setSeason(Number(e.target.value))}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    const series = await handleSeriesSearch(seriesName, season, setLoading)
                                    setFindingSeries(series)
                                }
                            }}
                        ></Input>
                    </div>
                </div>

                {findingSeries && !loading && (
                    <div className="flex flex-col items-center gap-y-2">
                        <img
                            src={`https://image.tmdb.org/t/p/w200${findingSeries.season_poster}`}
                            alt="movie"
                            width={'160px'}
                            className="rounded-md"
                        />
                        <h4 className="font-semibold text-xl">{findingSeries.original_title}</h4>
                        <h5 className="text-zinc-400">{findingSeries.genre}</h5>
                        <h5 className="text-zinc-400">Сезон: {findingSeries.season_number}</h5>
                        <Input
                            type="number"
                            max={10}
                            min={0}
                            placeholder="Введите вашу личную оценку (от 0 до 10)"
                            step={0.05}
                            onChange={(e) => setPersonalRating(Number(e.target.value))}
                        />
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center items-center h-[160px]">
                        <Loader2 className="w-26 h-26 animate-spin text-zinc-700" />
                    </div>
                )}

                <Button
                    type="button"
                    variant="primary"
                    onClick={async () => (
                        await handleSeriesAdd(findingSeries, personalRating, refetchSeries), setFindingSeries(null), setSeason(1)
                    )}
                    disabled={!findingSeries}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    )
}
