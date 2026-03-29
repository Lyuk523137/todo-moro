import { useState, useRef, useEffect } from 'react'
import {
    useGetTasksQuery,
    useAddTaskMutation,
    useDeleteTaskMutation,
    useCompleteTaskMutation,
    useIncompleteTaskMutation,
    useUpdateTaskMutation,
} from './services/tasksAPI'

interface Task {
    id: string
    text: string
    completed: boolean
    createdDate: number
    completedDate?: number
}

interface Toast {
    id: number
    message: string
}

type Filter = 'all' | 'active' | 'completed'

let toastCounter = 0

function TodoList() {
    const [newTask, setNewTask] = useState('')
    const [filter, setFilter] = useState<Filter>('all')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState('')
    const [toasts, setToasts] = useState<Toast[]>([])
    const editInputRef = useRef<HTMLInputElement>(null)

    const { data: tasks = [] as Task[], isLoading, isError } = useGetTasksQuery(undefined)

    const [addTask] = useAddTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()
    const [completeTask] = useCompleteTaskMutation()
    const [incompleteTask] = useIncompleteTaskMutation()
    const [updateTask] = useUpdateTaskMutation()

    useEffect(() => {
        if (editingId) editInputRef.current?.focus()
    }, [editingId])

    function showError(message: string) {
        const id = ++toastCounter
        setToasts((prev) => [...prev, { id, message }])
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
    }

    async function handleAddTask() {
        if (newTask.trim() === '') return
        try {
            await addTask({ text: newTask.trim() }).unwrap()
            setNewTask('')
        } catch {
            showError('Failed to add task. Please try again.')
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') handleAddTask()
    }

    async function handleToggleComplete(id: string, completed: boolean) {
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

    function startEditing(task: Task) {
        setEditingId(task.id)
        setEditingText(task.text)
    }

    async function commitEdit() {
        if (!editingId) return
        const trimmed = editingText.trim()
        if (trimmed) {
            try {
                await updateTask({ id: editingId, text: trimmed }).unwrap()
            } catch {
                showError('Failed to rename task. Please try again.')
            }
        }
        setEditingId(null)
    }

    function cancelEdit() {
        setEditingId(null)
    }

    function handleEditKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') commitEdit()
        if (event.key === 'Escape') cancelEdit()
    }

    async function handleMarkAllComplete() {
        const incomplete = visibleTasks.filter((t: Task) => !t.completed)
        const results = await Promise.allSettled(
            incomplete.map((t) => completeTask(t.id).unwrap())
        )
        const failed = results.filter((r) => r.status === 'rejected').length
        if (failed > 0) showError(`${failed} task(s) could not be marked as done.`)
    }

    async function handleClearCompleted() {
        const completed = (tasks as Task[]).filter((t: Task) => t.completed)
        const results = await Promise.allSettled(
            completed.map((t) => deleteTask(t.id).unwrap())
        )
        const failed = results.filter((r) => r.status === 'rejected').length
        if (failed > 0) showError(`${failed} task(s) could not be deleted.`)
    }

    const done = (tasks as Task[]).filter((t: Task) => t.completed).length
    const total = tasks.length

    const visibleTasks = (tasks as Task[]).filter((t: Task) => {
        if (filter === 'active') return !t.completed
        if (filter === 'completed') return t.completed
        return true
    })

    const allVisibleComplete = visibleTasks.length > 0 && visibleTasks.every((t: Task) => t.completed)

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

            {/* Toast notifications */}
            <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="bg-red-500 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-pulse"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        {toast.message}
                    </div>
                ))}
            </div>

            <div className="w-full max-w-lg">

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Todos</h1>
                        <p className="text-indigo-200 text-sm mt-1">{done} of {total} completed</p>
                        <div className="mt-3 h-1.5 bg-indigo-400/40 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500"
                                style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
                            />
                        </div>
                    </div>

                    {/* Input row */}
                    <div className="px-6 py-5 border-b border-slate-100 flex gap-3">
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            type="button"
                            onClick={handleAddTask}
                            className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-200 transition-all duration-150 cursor-pointer"
                        >
                            Add
                        </button>
                    </div>

                    {/* Bulk actions row */}
                    {visibleTasks.length > 0 && (
                        <div className="px-6 py-2.5 border-b border-slate-100 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handleMarkAllComplete}
                                disabled={allVisibleComplete}
                                className="flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-700 disabled:text-slate-300 disabled:cursor-not-allowed transition cursor-pointer"
                                title="Mark all visible tasks as done"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Mark all as done
                            </button>

                            {done > 0 && (
                                <button
                                    type="button"
                                    onClick={handleClearCompleted}
                                    className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-600 transition cursor-pointer"
                                    title="Delete all completed tasks"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Clear completed ({done})
                                </button>
                            )}
                        </div>
                    )}

                    {/* Task list */}
                    <ul className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                        {visibleTasks.length === 0 && (
                            <li className="py-12 text-center text-slate-400 text-sm">
                                {tasks.length === 0 ? 'No tasks yet — add one above!' : `No ${filter} tasks.`}
                            </li>
                        )}
                        {visibleTasks.map((task: Task) => (
                            <li
                                key={task.id}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition group"
                            >
                                {/* Complete toggle */}
                                <button
                                    type="button"
                                    onClick={() => handleToggleComplete(task.id, task.completed)}
                                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
                                        ${task.completed
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'border-slate-300 hover:border-indigo-400'
                                        }`}
                                    title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                >
                                    {task.completed && (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>

                                {/* Task text / inline edit */}
                                {editingId === task.id ? (
                                    <input
                                        ref={editInputRef}
                                        className="flex-1 text-sm text-left bg-slate-50 border border-indigo-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-100 transition"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        onKeyDown={handleEditKeyDown}
                                        onBlur={commitEdit}
                                    />
                                ) : (
                                    <span
                                        className={`flex-1 text-sm text-left transition-all duration-200 cursor-text ${
                                            task.completed ? 'line-through text-slate-400' : 'text-slate-700'
                                        }`}
                                        onDoubleClick={() => !task.completed && startEditing(task)}
                                        title={task.completed ? '' : 'Double-click to edit'}
                                    >
                                        {task.text}
                                    </span>
                                )}

                                {/* Delete button — visible on hover */}
                                {editingId !== task.id && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                await deleteTask(task.id).unwrap()
                                            } catch {
                                                showError('Failed to delete task. Please try again.')
                                            }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all duration-150 cursor-pointer"
                                        title="Delete task"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Filter bar */}
                    <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-400 shrink-0">{total - done} remaining</span>

                        <div className="flex gap-1">
                            {(['all', 'active', 'completed'] as Filter[]).map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-150 cursor-pointer
                                        ${filter === f
                                            ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-200'
                                            : 'text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <span className="text-xs text-slate-400 shrink-0">{total} total</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TodoList
