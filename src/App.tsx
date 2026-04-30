import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

type Filter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'todo-app.todos'

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const todo = value as Record<string, unknown>

  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'number'
  )
}

function loadTodos(): Todo[] {
  const savedTodos = window.localStorage.getItem(STORAGE_KEY)

  if (!savedTodos) {
    return []
  }

  try {
    const parsedTodos: unknown = JSON.parse(savedTodos)

    if (!Array.isArray(parsedTodos)) {
      console.error('Expected an array of todos in localStorage.')
      return []
    }

    return parsedTodos.filter(isTodo)
  } catch (error) {
    console.error('Failed to parse saved todos from localStorage.', error)
    return []
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const remainingTodos = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  )

  const filteredTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed)
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed)
    }

    return todos
  }, [filter, todos])

  const hasCompletedTodos = todos.some((todo) => todo.completed)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = draft.trim()

    if (!title) {
      return
    }

    setTodos((currentTodos) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: Date.now(),
      },
      ...currentTodos,
    ])
    setDraft('')
  }

  function toggleTodo(id: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  function deleteTodo(id: string) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  function clearCompletedTodos() {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed))
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <span className="hero-badge">React + TypeScript</span>
        <h1>Stay on top of what matters.</h1>
        <p className="hero-copy">
          A focused todo list with local persistence, quick filtering, and a
          clean GitHub Pages-friendly build.
        </p>
      </section>

      <section className="todo-card" aria-label="Todo list">
        <form className="todo-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="todo-title">
            Add a todo
          </label>
          <input
            id="todo-title"
            className="todo-input"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a task to tackle next"
          />
          <button type="submit" className="primary-button" disabled={!draft.trim()}>
            Add todo
          </button>
        </form>

        <div className="toolbar">
          <p className="summary">
            <strong>{remainingTodos}</strong> remaining
            <span className="summary-separator" aria-hidden="true">
              •
            </span>
            <span>{todos.length} total</span>
          </p>

          <div className="filters" role="tablist" aria-label="Filter todos">
            {(['all', 'active', 'completed'] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={filter === option}
                className={filter === option ? 'filter-chip is-active' : 'filter-chip'}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {filteredTodos.length > 0 ? (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <label className="todo-checkbox">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className={todo.completed ? 'todo-title is-complete' : 'todo-title'}>
                    {todo.title}
                  </span>
                </label>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            {todos.length === 0
              ? 'No todos yet. Add one above to get started.'
              : 'No todos match the current filter.'}
          </div>
        )}

        <div className="footer-bar">
          <span className="storage-note">Saved automatically in your browser.</span>
          <button
            type="button"
            className="ghost-button"
            onClick={clearCompletedTodos}
            disabled={!hasCompletedTodos}
          >
            Clear completed
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
