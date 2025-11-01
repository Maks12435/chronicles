import { handleTaskAdd } from '@/api/tasks'
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
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SelectGroup, SelectValue } from '@radix-ui/react-select'
import { useState } from 'react'

export default function AddTaskBox({ refetchTasks }: { refetchTasks: () => void }) {
    const [task, setTask] = useState({
        title: '',
        description: '',
        type: '',
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="text-sm py-1 px-4 font-medium cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-primary"
                    style={{ fontFamily: 'Roboto' }}
                >
                    Add new task
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Task addition</DialogTitle>
                    <DialogDescription>Fill all fields to provide full information about ypur task</DialogDescription>
                </DialogHeader>

                <Label htmlFor="title"></Label>
                <Input
                    id="title"
                    placeholder="Task title"
                    value={task?.title}
                    onChange={(e) => setTask((prev) => ({ ...prev, title: e.target.value }))}
                />

                <Label htmlFor="type"></Label>
                <Select
                    value={task.type}
                    onValueChange={(value) => setTask((prev) => ({ ...prev, type: value }))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>task types</SelectLabel>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="sport">Sport</SelectItem>
                            <SelectItem value="24h">24h</SelectItem>
                            <SelectItem value="week">week</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
							<SelectItem value="self-development">Self-development</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Label htmlFor="description"></Label>
                <Textarea
                    id="description"
                    placeholder="Task description"
                    onChange={(e) => setTask((prev) => ({ ...prev, description: e.target.value }))}
                />

                <Button
                    type="button"
                    className="bg-zinc-900 text-primary"
                    onClick={() => handleTaskAdd(task, refetchTasks)}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    )
}
