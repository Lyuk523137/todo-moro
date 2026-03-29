import type { Toast } from '../types'

interface Props {
    toasts: Toast[]
}

export function ToastList({ toasts }: Props) {
    return (
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
    )
}
