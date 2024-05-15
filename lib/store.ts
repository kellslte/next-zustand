import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { persist } from 'zustand/middleware'

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Task = {
  id: string
  title: string
  description?: string
  status: Status
}

export type State = {
  tasks: Task[]
  draggedTask: string | null
}

export type Actions = {
  addTask: (title: string, description?: string) => void
  dragTask: (id: string | null) => void
  removeTask: (id: string) => void
  updateTask: (id: string, status: Status) => void
}

export const useTaskStore = create<State & Actions>()(
  persist(
    set => ({
      tasks: [],
      draggedTask: null,
      addTask: (title: string, description?: string) =>
        set((state: State) => ({
          tasks: [
            ...state.tasks,
            {
              id: uuid(),
              title,
              description,
              status: 'TODO'
            }
          ]
        })),
      removeTask: (id: string) =>
        set((state: State) => ({
          tasks: state.tasks.filter((task: Task) => task.id !== id)
        })),
      updateTask: (id: string, status: Status) =>
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, status } : task
          )
        })),
      dragTask: (id: string | null) => set({ draggedTask: id })
    }),
    { name: 'task-store', skipHydration: true }
  )
)
