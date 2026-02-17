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
import type { MovieType } from '@/store/types'
import { Loader2, Search } from 'lucide-react'
import { handleMovieAdd, handleMovieSearch } from '@/api/shows'

export default function AddMovie({ refetchMovies }: { refetchMovies: () => void }) {
    const [movieName, setMovieName] = useState('')
    const [findingMovie, setFindingMovie] = useState<MovieType | null>(null)
    const [loading, setLoading] = useState(false)
    const [personalRating, setPersonalRating] = useState(0)

    return (
        <Dialog
            onOpenChange={() => {
                setFindingMovie(null), setMovieName('')
            }}
        >
            <DialogTrigger asChild>
                <Button variant="primary">Add new movie</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Movie search</DialogTitle>
                    <DialogDescription>Type movie name that you want to find</DialogDescription>
                </DialogHeader>

                <Label htmlFor="title"></Label>
                <div className="relative">
                    <Input
                        id="title"
                        placeholder="movie title"
                        value={movieName}
                        onChange={(e) => setMovieName(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                const movie = await handleMovieSearch(movieName, setLoading)
                                setFindingMovie(movie)
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
                        onClick={async () => {
                            const movie = await handleMovieSearch(movieName, setLoading)
                            setFindingMovie(movie)
                        }}
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                {findingMovie && !loading && (
                    <div className="flex flex-col items-center gap-y-2">
                        <img
                            src={`https://image.tmdb.org/t/p/w200${findingMovie.image}`}
                            alt="movie"
                            width={'160px'}
                            className="rounded-md"
                        />
                        <h4 className="font-semibold text-xl">{findingMovie.original_title}</h4>
                        <h5 className="text-zinc-400">{findingMovie.genre}</h5>
                        <Input
                            type="number"
                            max={10}
                            min={0}
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
                        await handleMovieAdd(findingMovie, personalRating, refetchMovies), setFindingMovie(null)
                    )}
                    disabled={!findingMovie}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    )
}
