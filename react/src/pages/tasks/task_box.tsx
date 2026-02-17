import { Card, CardContent, CardDescription } from '@/components/ui/card'
import type { TaskType } from '@/store/types'
import { CheckCircle, Expand, Loader, Star, Trash, XCircle } from 'lucide-react'
import { useState } from 'react'
import TaskUpdate from './task_update'
import { handleTaskDelete } from '@/api/tasks'
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

export default function TaskBox({ task, refetchTasks }: { task: TaskType; refetchTasks: () => void }) {
    const [expandedMode, setExpandedMode] = useState(false)

    return (
        <Card className="py-1 border-none relative rounded-lg">
            <div className="absolute z-20 bg-gradient-to-l from-cyan-800/20 via-transparent to-transparent inset-0 rounded-lg pointer-events-none"></div>

            <CardContent className="p-0 pr-2">
                <div className="flex flex-col">
                    <div className="grid grid-cols-12 justify-between items-center">
                        <div className="col-span-8">
                            <div className="flex gap-x-2">
                                <img
                                    src={
                                        task.type == 'education'
                                            ? 'assets/images/education.jpg'
                                            : task.type == 'sport'
                                            ? 'assets/images/sport.jpg'
                                            : task.type == '24h'
                                            ? 'assets/images/24h.jpg'
                                            : task.type == 'week'
                                            ? 'assets/images/week.jpg'
                                            : task.type == 'self-development'
                                            ? 'assets/images/self.jpg'
                                            : 'assets/images/entertainment.jpg'
                                    }
                                    alt="question"
                                    className="w-16 h-16 object-cover border border-zinc-700 rounded-md"
                                />
                                <div className="flex flex-col gap-y-1 w-full">
                                    <div className="flex gap-x-2 items-center">
                                        <h3 className="text-lg">{task.title}</h3>
                                        <div className="flex gap-x-1">
                                            {[...Array(task.difficulty)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-zinc-700" />
                                            ))}
                                        </div>
                                    </div>
                                    <CardDescription
                                        className={`overflow-x-hidden w-[80%] text-ellipsis ${
                                            expandedMode ? 'whitespace-normal' : 'whitespace-nowrap'
                                        }`}
                                    >
                                        {task.description}
                                    </CardDescription>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-3">
                            <h4 className="text-sm text-zinc-400">
                                {task.created_time?.slice(0, 10)} - {task.finished_time?.slice(0, 10) ?? '???'}
                            </h4>
                        </div>

                        <div className="col-span-1 w-full flex flex-col gap-y-2 items-end">
                            <div className="flex items-center gap-x-2">
                                {task.status === 'completed' ? (
                                    <div
                                        className="flex gap-x-1 items-center text-end rounded-full py-[2px] text-emerald-300 border-zinc-700 text-sm font-semibold"
                                        style={{ fontFamily: 'Roboto' }}
                                    >
                                        <CheckCircle />
                                    </div>
                                ) : task.status === 'failed' ? (
                                    <div
                                        className="flex gap-x-1 items-center rounded-full py-[2px] text-red-300 border-zinc-700 text-sm font-semibold"
                                        style={{ fontFamily: 'Roboto' }}
                                    >
                                        <XCircle />
                                    </div>
                                ) : (
                                    <div
                                        className="flex gap-x-1 items-center rounded-full py-[2px] text-cyan-300 border-zinc-700 text-sm font-semibold"
                                        style={{ fontFamily: 'Roboto' }}
                                    >
                                        <Loader />
                                    </div>
                                )}

                                {expandedMode && (
                                    <>
                                        {task.id !== null && (
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <Trash strokeWidth={2} size={20} />
                                                </AlertDialogTrigger>

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure that want to delete this task?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete
                                                            your task and remove your data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={async () => {
                                                                await handleTaskDelete(task.id!, refetchTasks),
                                                                    setExpandedMode(false)
                                                            }}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                        <TaskUpdate task={task} refetchTasks={refetchTasks} />
                                    </>
                                )}
                                <button
                                    onClick={() => setExpandedMode(!expandedMode)}
                                    className="text-zinc-400 hover:text-zinc-50"
                                >
                                    <Expand strokeWidth={2} width={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
