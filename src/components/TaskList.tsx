import type { Task, Filter } from '../types'
import { TaskItem } from './TaskItem'

interface Props {
    visibleTasks: Task[]
    totalCount: number
    filter: Filter
    onToggle: (id: string, completed: boolean) => void
    onDelete: (id: string) => void
    onUpdate: (id: string, text: string) => Promise<void>
}

export function TaskList({ visibleTasks, totalCount, filter, onToggle, onDelete, onUpdate }: Props) {
    return (
        <ul className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {visibleTasks.length === 0 && (
                <li className="py-12 text-center text-slate-400 text-sm">
                    {totalCount === 0 ? 'No tasks yet — add one above!' : `No ${filter} tasks.`}
                </li>
            )}
            {visibleTasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </ul>
    )
}
