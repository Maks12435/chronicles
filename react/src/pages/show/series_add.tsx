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
import type { SeriesType } from '@/static/types'
import { Search } from 'lucide-react'
import { handleSeriesAdd, handleSeriesSearch } from '@/api/shows'

export default function AddSeries({ refetchSeries }: { refetchSeries: () => void }) {
    const [seriesName, setSeriesName] = useState('')
    const [findingSeries, setFindingSeries] = useState<SeriesType | null>(null)
    const [season, setSeason] = useState<number>(1)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="text-sm py-1 px-4 font-medium cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-primary"
                    style={{ fontFamily: 'Roboto' }}
                >
                    Add new series
                </button>
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
                                    const series = await handleSeriesSearch(seriesName, season)
                                    setFindingSeries(series)
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
                            onClick={async () => {
                                const series = await handleSeriesSearch(seriesName, season)
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
                                    const series = await handleSeriesSearch(seriesName, season)
                                    setFindingSeries(series)
                                }
                            }}
                        ></Input>
                    </div>
                </div>

                {findingSeries && (
                    <div className="flex flex-col items-center gap-y-2">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${findingSeries.season_poster}`}
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
                            onChange={(e) =>
                                setFindingSeries({
                                    ...findingSeries,
                                    personal_rating: Number(e.target.value),
                                })
                            }
                        />
                    </div>
                )}
                <Button
                    type="button"
                    className="bg-zinc-900 text-primary"
                    onClick={() => handleSeriesAdd(findingSeries, refetchSeries)}
                    disabled={!findingSeries}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    )
}
