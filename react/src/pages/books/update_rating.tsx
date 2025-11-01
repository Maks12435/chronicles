import { useState } from 'react'
import { updateRating } from '@/api/books'
import toast from 'react-hot-toast'

export default function UpdateRating({ placeholder, book_id, refreshData }: { placeholder: string, book_id: number, refreshData: () => void}) {
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
			onClick={(e) => e.stopPropagation()}
            onChange={(e) => setUpdatedRating(e.target.value ? Number(e.target.value) : undefined)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && updatedRating !== undefined) {
                    if (updatedRating >= 0 && updatedRating <= 10) {
                        updateRating(updatedRating, book_id)
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
