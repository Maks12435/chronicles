import { Separator } from '@radix-ui/react-dropdown-menu'
import { CheckCircle, Filter, Loader2, Star, XCircle } from 'lucide-react'
import AddTaskBox from './task_add'
import { useQuery } from '@tanstack/react-query'
import type { TaskType } from '@/static/types'
import { fetchTasks } from '@/api/tasks'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import TaskBox from './task_box'
import { motion } from 'framer-motion'

export default function TaskStatistics() {
    const {
        data: tasks = [],
        isLoading,
        isError,
        refetch: refetchData,
    } = useQuery<TaskType[]>({
        queryKey: ['tasks'],
        queryFn: () => fetchTasks(),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })

    const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([])
    const [filteredStatus, setFilteredStatus] = useState('')
    const [filteredDifficulty, setFilteredDifficulty] = useState(0)

    useEffect(() => {
        if (filteredStatus) {
            setFilteredTasks(tasks.filter((t) => t.status === filteredStatus))
        }
        if (filteredDifficulty > 0) {
            setFilteredTasks(tasks.filter((t) => t.difficulty === filteredDifficulty))
        } else {
            setFilteredTasks(tasks)
        }
    }, [tasks, filteredStatus, filteredDifficulty])

    return (
        <>
            <div className="container py-4 relative">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src="assets/images/mark.png" alt="mark" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 grid grid-cols-10 gap-x-4 min-h-[500px]">
                    <div className="col-span-7">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg leading-tight" style={{ fontFamily: 'Staatliches' }}>
                                Current year tasks and achievements
                            </h3>

                            <div className="flex items-center gap-x-2">
                                <Popover>
                                    <PopoverTrigger>
                                        <Filter size={16} />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="flex flex-col gap-y-6">
                                            <div className="flex flex-col gap-y-2">
                                                <Label htmlFor="status">Status</Label>
                                                <ToggleGroup
                                                    value={filteredStatus}
                                                    type="single"
                                                    onValueChange={(value) => setFilteredStatus(value)}
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
                                            <div className="flex flex-col gap-y-2">
                                                <Label htmlFor="status">Difficulty</Label>
                                                <div className="flex gap-x-1">
                                                    {[1, 2, 3, 4, 5].map((num) => (
                                                        <button
                                                            key={num}
                                                            onClick={() =>
                                                                setFilteredDifficulty(
                                                                    filteredDifficulty === num ? 0 : num
                                                                )
                                                            }
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`w-6 h-6 ${
                                                                    num <= (filteredDifficulty ?? 0)
                                                                        ? 'text-cyan-800 fill-cyan-500'
                                                                        : 'text-gray-400'
                                                                }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <AddTaskBox refetchTasks={refetchData} />
                            </div>
                        </div>

                        <Separator className="h-[1px] bg-zinc-800 my-2 mb-4" />

                        {isLoading && (
                            <div className="flex justify-center items-center h-[160px]">
                                <Loader2 className="w-26 h-26 animate-spin text-zinc-700" />
                            </div>
                        )}

                        {isError && (
                            <div className="flex flex-col justify-center items-center h-[200px] gap-y-2">
                                <p className="text-red-700 text-lg font-semibold">Error durning loading data</p>
                                <Button onClick={() => refetchData()} variant={'custom'} className="max-w-48">
                                    Retry
                                </Button>
                            </div>
                        )}

                        <div className="flex flex-col gap-y-3 max-h-[80vh] overflow-y-scroll px-2 overflow-x-hidden">
                            {filteredTasks.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 200 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, delay: index * 0.15 }}
                                >
                                    <TaskBox key={index} task={item} refetchTasks={refetchData} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3"></div>
                </div>
            </div>
        </>
    )
}
