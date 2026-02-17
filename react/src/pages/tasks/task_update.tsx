import { handleTaskUpdate } from '@/api/tasks'
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { TaskType } from '@/store/types'
import { SelectValue } from '@radix-ui/react-select'
import { CheckCircle, Edit, Loader2, Star, XCircle } from 'lucide-react'
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function TaskUpdate({ task, refetchTasks }: { task: TaskType; refetchTasks: () => void }) {
    const [updatedTask, setUpdatedTask] = useState(task)

    return (
        <Dialog>
            <DialogTrigger className="flex items-center">
                <button className="text-zinc-400 hover:text-zinc-50">
                    <Edit strokeWidth={2} size={20} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Task update</DialogTitle>
                    <DialogDescription>Fill all fields to provide full information about ypur task</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        placeholder={updatedTask.title}
                        value={updatedTask?.title}
                        onChange={(e) => setUpdatedTask((prev) => ({ ...prev, title: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="type">Task type</Label>
                    <Select
                        value={updatedTask.type}
                        onValueChange={(value) => setUpdatedTask((prev) => ({ ...prev, type: value }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
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
                </div>
                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={updatedTask.description}
                        className="h-[200px]"
                        onChange={(e) => setUpdatedTask((prev) => ({ ...prev, description: e.target.value }))}
                    />
                </div>

                <div className="grid grid-cols-10 items-center">
                    <div className="col-span-5">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="status">Status</Label>
                            <ToggleGroup
                                value={updatedTask.status}
                                type="single"
                                onValueChange={(value) => setUpdatedTask((prev) => ({ ...prev, status: value }))}
                            >
                                <ToggleGroupItem value="completed">
                                    <CheckCircle size={20} className="text-emerald-300" />
                                </ToggleGroupItem>
                                <ToggleGroupItem value="failed">
                                    <XCircle size={20} className="text-red-300" />
                                </ToggleGroupItem>
                                <ToggleGroupItem value="in progress">
                                    <Loader2 size={20} className="text-cyan-300" />
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </div>
                    <div className="col-span-5">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="status">Status</Label>
                            <div className="flex gap-x-1">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setUpdatedTask((prev) => ({ ...prev, difficulty: num }))}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${
                                                num <= (updatedTask.difficulty ?? 0)
                                                    ? 'text-cyan-800 fill-cyan-500'
                                                    : 'text-gray-400'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger>Update</AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure that want to update this task?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently update your task and remove your previous
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (updatedTask.id !== undefined) {
                                        handleTaskUpdate(updatedTask, updatedTask.id, refetchTasks)
                                    }
                                }}
                            >
                                Update
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    )
}
