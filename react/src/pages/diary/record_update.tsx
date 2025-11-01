import { handleDiaryRecordAdd, handleDiaryRecordUpdate } from '@/api/diary'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { DiaryType } from '@/static/types'
import { Edit } from 'lucide-react'
import { useState } from 'react'

export default function RecordUpdate({ data, refetchData }: { data: DiaryType; refetchData: () => void }) {
    const [updatedRecord, setUpdatedRecord] = useState<DiaryType>(data)

    const handleSubmit = async (e: React.FormEvent) => {
        if (!data.id) {
            console.error('Record id is missing')
            return
        }

        e.preventDefault()
        await handleDiaryRecordUpdate(updatedRecord, data.id, refetchData)
    }

    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <Edit size={18} className="text-zinc-400 hover:text-zinc-50" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reord update</DialogTitle>
                        <DialogDescription>
                            Fill the fields with the information related to your thought, dream or day for updating
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="flex flex-col gap-y-4"
                        onSubmit={(e) => {
                            handleSubmit(e)
                        }}
                    >
                        <div className="flex flex-col gap-y-1">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="tilte"
                                onChange={(e) => setUpdatedRecord((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder={data.title}
								value={updatedRecord.title}
                                required
                            ></Input>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <Label htmlFor="type">Record type</Label>
                            <Select
                                value={updatedRecord.record_type}
                                onValueChange={(value) => setUpdatedRecord((prev) => ({ ...prev, record_type: value }))}
                                required
                            >
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Select type"></SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>record types</SelectLabel>
                                        <SelectItem value="thought">Thought</SelectItem>
                                        <SelectItem value="dream">Dream</SelectItem>
                                        <SelectItem value="day">Day</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                onChange={(e) => setUpdatedRecord((prev) => ({ ...prev, description: e.target.value }))}
                                className="max-h-[300px]"
                                placeholder={data.description}
								value={updatedRecord.description}
                                required
                            ></Textarea>
                        </div>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
