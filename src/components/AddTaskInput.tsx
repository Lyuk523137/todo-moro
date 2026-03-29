interface Props {
    value: string
    onChange: (value: string) => void
    onAdd: () => void
}

export function AddTaskInput({ value, onChange, onAdd }: Props) {
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') onAdd()
    }

    return (
        <div className="px-6 py-5 border-b border-slate-100 flex gap-3">
            <input
                type="text"
                placeholder="What needs to be done?"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button
                type="button"
                onClick={onAdd}
                className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-200 transition-all duration-150 cursor-pointer"
            >
                Add
            </button>
        </div>
    )
}
