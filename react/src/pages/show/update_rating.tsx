import { useState } from 'react'
import { updateRating } from '@/api/shows'
import toast from 'react-hot-toast'

export default function UpdateRating({ placeholder, movie_id, refreshData, type }: { placeholder: string, movie_id: number, refreshData: () => void, type: string }) {
    const [updatedRating, setUpdatedRating] = useState<number | undefined>()

    return (
        <input
            className="border-none bg-transparent h-5 w-full focus:outline-none text-center"
            placeholder={placeholder}
            type="number"
            max={10}
            min={0}
            step={0.05}
            value={updatedRating ?? ''}
            onChange={(e) => setUpdatedRating(e.target.value ? Number(e.target.value) : undefined)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && updatedRating !== undefined) {
                    if (updatedRating >= 0 && updatedRating <= 10) {
                        updateRating(updatedRating, movie_id, type)
                        refreshData()
                        toast.success('Raiting successfully updated')
                    } else {
                        toast.error('Raiting is out of range')
                    }
                }
            }}
        />
    )
}
