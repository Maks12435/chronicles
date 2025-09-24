import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Edit } from 'lucide-react'
import type { ArtistType, TrackType } from '@/static/types'
import { saveYearData } from '@/store/storage'
import { handleTrackSearch, handleArtistSearch } from '@/api/tracks'
import { useSelectedYearMusic } from '@/store/yearStore'

export default function DataCorrectorBox({ type }: { type: string }) {
    const [artistName, setArtistName] = useState('')
    const [trackName, setTrackName] = useState('')
    const [editMainMode, setEditMainMode] = useState(false)
    const [findingArtist, setFindingArtist] = useState<ArtistType | null>(null)
    const [findingTrack, setFindingTrack] = useState<TrackType | null>(null)
    const { selectedYear } = useSelectedYearMusic()

    return (
        <Dialog>
            <DialogTrigger>
                <button onClick={() => setEditMainMode(!editMainMode)}>
                    <Edit className="w-4 text-zinc-500" strokeWidth={2} />
                </button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-y-6">
                <DialogHeader>Edit best musical performances and performers of the year</DialogHeader>
                <div className="flex flex-col gap-y-2">
                    {type === 'artist' && (
                        <>
                            <Label htmlFor="artist">Best artist of the Year</Label>
                            <Input
                                id="artist"
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter') {
                                        const result = await handleArtistSearch(artistName)
                                        setFindingArtist(result)
                                    }
                                }}
                            ></Input>
                        </>
                    )}
                    {type === 'track' && (
                        <>
                            <Label htmlFor="artist">Best track of the Year</Label>
                            <Input
                                id="track"
                                value={trackName}
                                onChange={(e) => setTrackName(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter') {
                                        const result = await handleTrackSearch(trackName)
                                        setFindingTrack(result)
                                    }
                                }}
                            ></Input>
                        </>
                    )}
                    {findingArtist && type === 'artist' && (
                        <div className="flex flex-col items-center p-4">
                            <img src={findingArtist.image} alt="track" className="rounded-md w-[140px]" />
                            <h5 className="text-zinc-400">{findingArtist.name}</h5>
                            <h5 className="text-zinc-400">{findingArtist.genre}</h5>
                        </div>
                    )}
                    {findingTrack && type === 'track' && (
                        <div className="flex flex-col items-center p-4">
                            <img src={findingTrack.image} alt="track" className="rounded-md w-[140px]" />
                            <h5 className="text-zinc-400">{findingTrack.title}</h5>
                            <h5 className="text-zinc-400">{findingTrack.genre}</h5>
                        </div>
                    )}
                </div>
                <Button
                    className="text-primary bg-background border"
                    onClick={() => {
                        if (findingArtist || findingTrack) {
                            saveYearData(
                                selectedYear,
                                type === 'artist'
                                    ? { artist: findingArtist }
                                    : type === 'track'
                                    ? { track: findingTrack }
                                    : {}
                            )
                            setEditMainMode(false)
                        }
                    }}
                >
                    Confirm changes
                </Button>
            </DialogContent>
        </Dialog>
    )
}
