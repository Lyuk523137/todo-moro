interface Props {
    done: number
    total: number
}

export function TodoHeader({ done, total }: Props) {
    return (
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
    )
}
