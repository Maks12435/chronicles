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
import { Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { type TrackType } from '@/store/types'
import { handleTrackAdd, handleTrackSearch } from '@/api/tracks'
import { useSelectedYearMusic } from '@/store/global-variables'

export default function AddSongBox({ refetchTracks }: { refetchTracks: () => void }) {
    const [trackName, setTrackName] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const { selectedYear } = useSelectedYearMusic()
    const [findingTrack, setFindingTrack] = useState<TrackType | null>(null)
    const [loading, setLoading] = useState(false)

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant={'primary'} style={{ fontFamily: 'Roboto' }} onClick={() => setOpenDialog(true)}>
                    Add new song
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Song search</DialogTitle>
                    <DialogDescription>Type song name that you want to find</DialogDescription>
                </DialogHeader>

                <Label htmlFor="title"></Label>
                <div className="relative">
                    <Input
                        id="title"
                        placeholder="Song title"
                        value={trackName}
                        onChange={(e) => setTrackName(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                const result = await handleTrackSearch(trackName, setLoading)
                                setFindingTrack(result)
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
                        onClick={async () => {
                            const result = await handleTrackSearch(trackName, setLoading)
                            setFindingTrack(result)
                        }}
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                {loading && (
                    <div className="flex flex-col items-center p-4">
                        <Loader2 className="w-26 h-26 animate-spin text-zinc-700" />
                    </div>
                )}

                {findingTrack && !loading && (
                    <div className="flex flex-col items-center p-4">
                        <img src={findingTrack.mid_image} alt="track" className="rounded-md w-[140px]" />
                        <h4 className="font-semibold text-xl">{findingTrack.title}</h4>
                        <h5 className="text-zinc-400">{findingTrack.artist}</h5>
                    </div>
                )}

                <Button
                    type="button"
                    className="bg-zinc-900 text-primary"
                    onClick={async () => {
                        if (findingTrack) {
                            await handleTrackAdd(findingTrack, selectedYear, refetchTracks)
                            setFindingTrack(null)
                        }
                    }}
                    disabled={!findingTrack}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    )
}
