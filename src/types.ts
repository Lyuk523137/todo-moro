export interface Task {
    id: string
    text: string
    completed: boolean
    createdDate: number
    completedDate?: number
}

export interface Toast {
    id: number
    message: string
}

export type Filter = 'all' | 'active' | 'completed'
