import { useState } from 'react'
import {
    useGetTasksQuery,
    useAddTaskMutation,
    useDeleteTaskMutation,
    useCompleteTaskMutation,
    useIncompleteTaskMutation,
    useUpdateTaskMutation,
} from './services/tasksAPI'
import { useToast } from './hooks/useToast'
import type { Task, Filter } from './types'
import { ToastList } from './components/ToastList'
import { TodoHeader } from './components/TodoHeader'
import { AddTaskInput } from './components/AddTaskInput'
import { BulkActions } from './components/BulkActions'
import { TaskList } from './components/TaskList'
import { FilterBar } from './components/FilterBar'

function TodoList() {
    const [newTask, setNewTask] = useState('')
    const [filter, setFilter] = useState<Filter>('all')
    const { toasts, showError } = useToast()

    const { data: tasks = [] as Task[], isLoading, isError } = useGetTasksQuery(undefined)
    const [addTask] = useAddTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()
    const [completeTask] = useCompleteTaskMutation()
    const [incompleteTask] = useIncompleteTaskMutation()
    const [updateTask] = useUpdateTaskMutation()

    async function handleAddTask() {
        if (newTask.trim() === '') return
        try {
            await addTask({ text: newTask.trim() }).unwrap()
            setNewTask('')
        } catch {
            showError('Failed to add task. Please try again.')
        }
    }

    async function handleToggle(id: string, completed: boolean) {
        try {
            if (completed) {
                await incompleteTask(id).unwrap()
            } else {
                await completeTask(id).unwrap()
            }
        } catch {
            showError('Failed to update task status. Please try again.')
        }
    }

    async function handleUpdate(id: string, text: string) {
        try {
            await updateTask({ id, text }).unwrap()
        } catch {
            showError('Failed to rename task. Please try again.')
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteTask(id).unwrap()
        } catch {
            showError('Failed to delete task. Please try again.')
        }
    }

    async function handleMarkAllComplete() {
        const incomplete = visibleTasks.filter((t) => !t.completed)
        const results = await Promise.allSettled(
            incomplete.map((t) => completeTask(t.id).unwrap())
        )
        const failed = results.filter((r) => r.status === 'rejected').length
        if (failed > 0) showError(`${failed} task(s) could not be marked as done.`)
    }

    async function handleClearCompleted() {
        const completed = (tasks as Task[]).filter((t) => t.completed)
        const results = await Promise.allSettled(
            completed.map((t) => deleteTask(t.id).unwrap())
        )
        const failed = results.filter((r) => r.status === 'rejected').length
        if (failed > 0) showError(`${failed} task(s) could not be deleted.`)
    }

    const done = (tasks as Task[]).filter((t) => t.completed).length
    const total = tasks.length

    const visibleTasks = (tasks as Task[]).filter((t) => {
        if (filter === 'active') return !t.completed
        if (filter === 'completed') return t.completed
        return true
    })

    const allVisibleComplete = visibleTasks.length > 0 && visibleTasks.every((t) => t.completed)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 border-4 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                    <span className="text-sm font-medium">Loading tasks…</span>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm">
                    <p className="text-2xl mb-2">⚠️</p>
                    <p className="text-red-500 font-semibold">Could not load tasks</p>
                    <p className="text-slate-400 text-sm mt-1">Make sure the server is running on port 8080.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-start justify-center pt-16 px-4">
            <ToastList toasts={toasts} />

            <div className="w-full max-w-lg">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <TodoHeader done={done} total={total} />

                    <AddTaskInput value={newTask} onChange={setNewTask} onAdd={handleAddTask} />

                    {visibleTasks.length > 0 && (
                        <BulkActions
                            allVisibleComplete={allVisibleComplete}
                            completedCount={done}
                            onMarkAll={handleMarkAllComplete}
                            onClearCompleted={handleClearCompleted}
                        />
                    )}

                    <TaskList
                        visibleTasks={visibleTasks}
                        totalCount={total}
                        filter={filter}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />

                    <FilterBar
                        filter={filter}
                        remaining={total - done}
                        total={total}
                        onChange={setFilter}
                    />
                </div>
            </div>
        </div>
    )
}

export default TodoList
