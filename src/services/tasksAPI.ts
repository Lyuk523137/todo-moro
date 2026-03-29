import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const tasksAPI = createApi({
    reducerPath: 'tasksAPI',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    tagTypes: ['Task'],
    endpoints: (builder) => ({
        // GET /tasks — fetch all tasks
        getTasks: builder.query({
            query: () => '/tasks',
            providesTags: ['Task'],
        }),

        // GET /tasks/completed — fetch completed tasks only
        getCompletedTasks: builder.query({
            query: () => '/tasks/completed',
            providesTags: ['Task'],
        }),

        // POST /tasks — create a new task { text: string }
        addTask: builder.mutation({
            query: (newTask) => ({
                url: '/tasks',
                method: 'POST',
                body: newTask,
            }),
            invalidatesTags: ['Task'],
        }),

        // POST /tasks/{id} — update task text
        updateTask: builder.mutation({
            query: ({ id, text }) => ({
                url: `/tasks/${id}`,
                method: 'POST',
                body: { text },
            }),
            invalidatesTags: ['Task'],
        }),

        // DELETE /tasks/{id} — delete a task
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),

        // POST /tasks/{id}/complete — mark task as completed
        completeTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}/complete`,
                method: 'POST',
            }),
            invalidatesTags: ['Task'],
        }),

        // POST /tasks/{id}/incomplete — mark task as not completed
        incompleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}/incomplete`,
                method: 'POST',
            }),
            invalidatesTags: ['Task'],
        }),
    }),
})

// RTK Query auto-generates these hooks from the endpoint names above:

export const {
    useGetTasksQuery,
    useGetCompletedTasksQuery,
    useAddTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useCompleteTaskMutation,
    useIncompleteTaskMutation,
} = tasksAPI
