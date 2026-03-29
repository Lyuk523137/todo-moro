import type { Filter } from '../types'

interface Props {
    filter: Filter
    remaining: number
    total: number
    onChange: (filter: Filter) => void
}

export function FilterBar({ filter, remaining, total, onChange }: Props) {
    return (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400 shrink-0">{remaining} remaining</span>

            <div className="flex gap-1">
                {(['all', 'active', 'completed'] as Filter[]).map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => onChange(f)}
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
    )
}
