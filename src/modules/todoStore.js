/**
 * TodoStore — State management module
 * Handles CRUD operations, filtering, reordering, and localStorage persistence
 */

const STORAGE_KEY = 'todo-app-data';

// Default todos matching the design
const DEFAULT_TODOS = [
  { id: crypto.randomUUID(), text: 'Complete online JavaScript course', completed: true, order: 0 },
  { id: crypto.randomUUID(), text: 'Jog around the park 3x', completed: false, order: 1 },
  { id: crypto.randomUUID(), text: '10 minutes meditation', completed: false, order: 2 },
  { id: crypto.randomUUID(), text: 'Read for 1 hour', completed: false, order: 3 },
  { id: crypto.randomUUID(), text: 'Pick up groceries', completed: false, order: 4 },
  { id: crypto.randomUUID(), text: 'Complete Todo App on Frontend Mentor', completed: false, order: 5 },
];

export class TodoStore {
  constructor() {
    this.todos = this.load();
    this.listeners = [];
  }

  /**
   * Subscribe to store changes
   * @param {Function} listener 
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Notify all listeners of state change
   */
  notify() {
    this.save();
    this.listeners.forEach(fn => fn(this.todos));
  }

  /**
   * Add a new todo
   * @param {string} text 
   */
  addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      order: this.todos.length,
    };

    this.todos.push(todo);
    this.notify();
    return todo;
  }

  /**
   * Toggle a todo's completed state
   * @param {string} id 
   */
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.notify();
    }
  }

  /**
   * Delete a todo by id
   * @param {string} id 
   */
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.reindex();
    this.notify();
  }

  /**
   * Clear all completed todos
   */
  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this.reindex();
    this.notify();
  }

  /**
   * Get the count of active (uncompleted) items
   * @returns {number}
   */
  getActiveCount() {
    return this.todos.filter(t => !t.completed).length;
  }

  /**
   * Get filtered todos
   * @param {'all' | 'active' | 'completed'} filter 
   * @returns {Array}
   */
  getFiltered(filter) {
    switch (filter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return [...this.todos];
    }
  }

  /**
   * Reorder todos by moving item from one index to another
   * @param {number} fromIndex 
   * @param {number} toIndex 
   */
  reorder(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    const [moved] = this.todos.splice(fromIndex, 1);
    this.todos.splice(toIndex, 0, moved);
    this.reindex();
    this.notify();
  }

  /**
   * Reindex all items' order property
   */
  reindex() {
    this.todos.forEach((todo, i) => {
      todo.order = i;
    });
  }

  /**
   * Save to localStorage
   */
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    } catch (e) {
      console.warn('TodoStore: Failed to save to localStorage', e);
    }
  }

  /**
   * Load from localStorage, fallback to defaults
   * @returns {Array}
   */
  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('TodoStore: Failed to load from localStorage', e);
    }
    return [...DEFAULT_TODOS];
  }
}
