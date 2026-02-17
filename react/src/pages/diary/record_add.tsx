import { handleDiaryRecordAdd } from '@/api/diary'
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
import type { DiaryType } from '@/store/types'
import { useState } from 'react'

export default function RecordAdd({ refetchData }: { refetchData: () => void }) {
    const [record, setRecord] = useState<DiaryType>({
        title: '',
        description: '',
        created_time: null,
        record_type: '',
    })
	
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await handleDiaryRecordAdd(record, refetchData)
        setRecord({
            title: '',
            description: '',
            created_time: null,
            record_type: '',
        })
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="primary">Add new record</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record add</DialogTitle>
                    <DialogDescription>
                        Fill the fields with the information related to your thought, dream or day
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-y-1">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            onChange={(e) => setRecord((prev) => ({ ...prev, title: e.target.value }))}
                            required
                        ></Input>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <Label htmlFor="type">Record type</Label>
                        <Select
                            value={record.record_type}
                            onValueChange={(value) => setRecord((prev) => ({ ...prev, record_type: value }))}
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
                            onChange={(e) => setRecord((prev) => ({ ...prev, description: e.target.value }))}
                            className="max-h-[300px]"
                            required
                        ></Textarea>
                    </div>
                    <Button variant="primary" type="submit">
                        Add
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
