import axios from 'axios'
import { defineStore } from 'pinia'

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'completed', label: 'Done' },
]

function emptyForm() {
  return {
    completed: false,
    title: '',
    userId: 1,
  }
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    todoForm: emptyForm(),
    isEdit: false,
    editingId: null,
    filter: 'all',
    filterOptions: FILTER_OPTIONS,
    loading: false,
  }),
  getters: {
    remainingCount: (state) => state.todos.filter((todo) => !todo.completed).length,
    completedCount: (state) => state.todos.filter((todo) => todo.completed).length,
    visibleTodos: (state) => {
      if (state.filter === 'open') {
        return state.todos.filter((todo) => !todo.completed)
      }
      if (state.filter === 'completed') {
        return state.todos.filter((todo) => todo.completed)
      }
      return state.todos
    },
  },
  actions: {
    async getToDos() {
      this.loading = true
      try {
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos')
        this.todos = data
      } finally {
        this.loading = false
      }
    },
    async createTodo() {
      const title = this.todoForm.title?.trim()
      if (!title) {
        return
      }

      const payload = { ...this.todoForm, title }
      let created = {
        ...payload,
        id: Date.now(),
        title,
        completed: false,
      }

      try {
        await axios.post('https://jsonplaceholder.typicode.com/todos', payload)
      } catch {
        // jsonplaceholder is a mock API; keep the local task if the request fails
      }

      this.todos.unshift(created)
      this.resetForm()
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      } catch {
        // Newly created mock ids can 500; still remove locally
      }
      this.todos = this.todos.filter((todo) => todo.id !== id)
      if (this.editingId === id) {
        this.resetForm()
      }
    },
    async editTodo(id) {
      const existing = this.todos.find((todo) => todo.id === id)
      if (existing) {
        this.todoForm = {
          completed: existing.completed,
          title: existing.title,
          userId: existing.userId ?? 1,
        }
        this.isEdit = true
        this.editingId = id
        return
      }

      const { data } = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`)
      this.todoForm = {
        completed: data.completed,
        title: data.title,
        userId: data.userId ?? 1,
      }
      this.isEdit = true
      this.editingId = id
    },
    async updateTodo() {
      const id = this.editingId
      const title = this.todoForm.title?.trim()
      if (!id || !title) {
        return
      }

      const payload = { ...this.todoForm, title }
      this.todos = this.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              title,
            }
          : todo
      )
      this.resetForm()

      try {
        await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, payload)
      } catch {
        // jsonplaceholder returns 500 for ids it did not persist
      }
    },
    toggleCompleted(id) {
      this.todos = this.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    },
    setFilter(filter) {
      this.filter = filter
    },
    cancelEdit() {
      this.resetForm()
    },
    resetForm() {
      this.todoForm = emptyForm()
      this.isEdit = false
      this.editingId = null
    },
  },
})
