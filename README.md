# Todo App — Morosystems Assessment

A todo list application built as part of the Morosystems frontend assessment.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- The backend server from [morosystems/todo-be](https://github.com/morosystems/todo-be) running locally on port `8080`

### 1. Start the backend

Follow the instructions in the [todo-be README](https://github.com/morosystems/todo-be) to get the API server running. It must be available at `http://localhost:8080`.

### 2. Install dependencies

```bash
npm install
```

### 3. Run the frontend

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library — component tree, state, effects |
| **TypeScript** | Static typing across all components, hooks, and API definitions |
| **Redux Toolkit** | Global state management library |
| **RTK Query** | API layer built into Redux Toolkit — handles data fetching, caching, and cache invalidation automatically |
| **Vite** | Build tool and dev server — extremely fast HMR (hot module replacement) during development |
| **Tailwind CSS v4** | Utility-first CSS framework — all styling is done via class names, no separate CSS files |

---

## Project Structure

```
src/
├── types.ts                  # Shared TypeScript interfaces (Task, Filter, Toast)
├── store.ts                  # Redux store setup
├── main.tsx                  # App entry point with Redux Provider
├── App.tsx                   # Root component
├── todo.tsx                  # Main page — data fetching and event handlers
├── hooks/
│   └── useToast.ts           # Custom hook for error toast notifications
├── services/
│   └── tasksAPI.ts           # RTK Query API definition (all endpoints)
└── components/
    ├── TodoHeader.tsx         # Gradient header with progress bar
    ├── AddTaskInput.tsx       # Text input and Add button
    ├── BulkActions.tsx        # "Mark all as done" and "Clear completed" buttons
    ├── TaskList.tsx           # Scrollable task list container
    ├── TaskItem.tsx           # Single task row with inline editing
    ├── FilterBar.tsx          # All / Active / Completed filter tabs
    └── ToastList.tsx          # Error notification toasts
```

---

## Features

- Add, rename (double-click), and delete tasks
- Mark tasks as complete / incomplete
- Mark all visible tasks as done at once
- Delete all completed tasks at once
- Filter tasks by All / Active / Completed
- Progress bar showing completion count
- Error handling — all failed API calls show a toast notification
- All changes are persisted to the backend via REST API
