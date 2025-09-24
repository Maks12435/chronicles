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
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { type TrackType } from '@/static/types'
import { handleTrackAdd, handleTrackSearch } from '@/api/tracks'
import { useSelectedYearMusic } from '@/store/yearStore'

export default function AddSongBox({ refetchTracks }: { refetchTracks: () => void }) {
    const [trackName, setTrackName] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const { selectedYear } = useSelectedYearMusic()
    const [findingTrack, setFindingTrack] = useState<TrackType | null>(null)

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <button
                    className="text-sm py-1 px-4 font-medium cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-primary"
                    style={{ fontFamily: 'Roboto' }}
                    onClick={() => setOpenDialog(true)}
                >
                    Add new song
                </button>
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
                                const result = await handleTrackSearch(trackName)
                                setFindingTrack(result)
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
                        onClick={async () => {
                            const result = await handleTrackSearch(trackName)
                            setFindingTrack(result)
                        }}
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                {findingTrack && (
                    <div className="flex flex-col items-center p-4">
                        <img src={findingTrack.image} alt="track" className="rounded-md w-[140px]" />
                        <h4 className="font-semibold text-xl">{findingTrack.title}</h4>
                        <h5 className="text-zinc-400">{findingTrack.artist}</h5>
                    </div>
                )}

                <Button
                    type="button"
                    className="bg-zinc-900 text-primary"
                    onClick={() => {
                        if (findingTrack) {
                            handleTrackAdd(findingTrack, selectedYear, refetchTracks)
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
