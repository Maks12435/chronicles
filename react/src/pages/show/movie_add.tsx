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
import type { MovieType } from '@/static/types'
import { Search } from 'lucide-react'
import { handleMovieAdd, handleMovieSearch } from '@/api/shows'

export default function AddMovie({ refetchMovies }: { refetchMovies: () => void }) {
    const [movieName, setmovieName] = useState('')
    const [findingMovie, setFindingMovie] = useState<MovieType | null>(null)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="text-sm py-1 px-4 font-medium cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-primary"
                    style={{ fontFamily: 'Roboto' }}
                >
                    Add new movie
                </button>
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
                        onChange={(e) => setmovieName(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                const movie = await handleMovieSearch(movieName)
                                setFindingMovie(movie)
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
                        onClick={async () => {
                            const movie = await handleMovieSearch(movieName)
                            setFindingMovie(movie)
                        }}
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                {findingMovie && (
                    <div className="flex flex-col items-center gap-y-2">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${findingMovie.image}`}
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
                            onChange={(e) =>
                                setFindingMovie({
                                    ...findingMovie,
                                    personal_rating: Number(e.target.value),
                                })
                            }
                        />
                    </div>
                )}
                <Button
                    type="button"
                    className="bg-zinc-900 text-primary"
                    onClick={() => handleMovieAdd(findingMovie, refetchMovies)}
                    disabled={!findingMovie}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    )
}
