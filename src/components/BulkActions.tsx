interface Props {
    allVisibleComplete: boolean
    completedCount: number
    onMarkAll: () => void
    onClearCompleted: () => void
}

export function BulkActions({ allVisibleComplete, completedCount, onMarkAll, onClearCompleted }: Props) {
    return (
        <div className="px-6 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <button
                type="button"
                onClick={onMarkAll}
                disabled={allVisibleComplete}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-700 disabled:text-slate-300 disabled:cursor-not-allowed transition cursor-pointer"
                title="Mark all visible tasks as done"
            >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Mark all as done
            </button>

            {completedCount > 0 && (
                <button
                    type="button"
                    onClick={onClearCompleted}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-600 transition cursor-pointer"
                    title="Delete all completed tasks"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear completed ({completedCount})
                </button>
            )}
        </div>
    )
}
