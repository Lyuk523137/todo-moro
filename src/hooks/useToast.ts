import { useState } from 'react'
import type { Toast } from '../types'

let toastCounter = 0

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])

    function showError(message: string) {
        const id = ++toastCounter
        setToasts((prev) => [...prev, { id, message }])
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
    }

    return { toasts, showError }
}
