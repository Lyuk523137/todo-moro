import { useState, useRef, useEffect } from 'react'
import type { Task } from '../types'

interface Props {
    task: Task
    onToggle: (id: string, completed: boolean) => void
    onDelete: (id: string) => void
    onUpdate: (id: string, text: string) => Promise<void>
}

export function TaskItem({ task, onToggle, onDelete, onUpdate }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(task.text)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing) inputRef.current?.focus()
    }, [isEditing])

    function startEditing() {
        if (task.completed) return
        setEditText(task.text)
        setIsEditing(true)
    }

    async function commitEdit() {
        const trimmed = editText.trim()
        if (trimmed && trimmed !== task.text) {
            await onUpdate(task.id, trimmed)
        }
        setIsEditing(false)
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') commitEdit()
        if (event.key === 'Escape') setIsEditing(false)
    }

    return (
        <li className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition group">

            {/* Complete toggle */}
            <button
                type="button"
                onClick={() => onToggle(task.id, task.completed)}
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
            {isEditing ? (
                <input
                    ref={inputRef}
                    className="flex-1 text-sm text-left bg-slate-50 border border-indigo-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-100 transition"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={commitEdit}
                />
            ) : (
                <span
                    className={`flex-1 text-sm text-left transition-all duration-200 cursor-text ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-700'
                    }`}
                    onDoubleClick={startEditing}
                    title={task.completed ? '' : 'Double-click to edit'}
                >
                    {task.text}
                </span>
            )}

            {/* Delete button — visible on hover */}
            {!isEditing && (
                <button
                    type="button"
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all duration-150 cursor-pointer"
                    title="Delete task"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </li>
    )
}
