/**
 * TodoRenderer — DOM rendering module
 * Builds and updates the todo list UI, handles event delegation
 */

export class TodoRenderer {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.listEl - The <ul> todo list element
   * @param {HTMLElement} options.itemsLeftEl - The items left counter element
   * @param {HTMLElement} options.inputEl - The todo input element
   * @param {Function} options.onToggle - Callback when checkbox is clicked
   * @param {Function} options.onDelete - Callback when delete button is clicked
   * @param {Function} options.onAdd - Callback when new todo is submitted
   * @param {Function} options.onFilter - Callback when filter button is clicked
   * @param {Function} options.onClearCompleted - Callback when clear completed is clicked
   */
  constructor({ listEl, itemsLeftEl, inputEl, onToggle, onDelete, onAdd, onFilter, onClearCompleted }) {
    this.listEl = listEl;
    this.itemsLeftEl = itemsLeftEl;
    this.inputEl = inputEl;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.onAdd = onAdd;
    this.onFilter = onFilter;
    this.onClearCompleted = onClearCompleted;

    this.currentFilter = 'all';

    this.initEventListeners();
  }

  /**
   * Set up event delegation & input handler
   */
  initEventListeners() {
    // New todo on Enter
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const text = this.inputEl.value;
        if (text.trim()) {
          this.onAdd(text);
          this.inputEl.value = '';
        }
      }
    });

    // Event delegation on the todo list
    this.listEl.addEventListener('click', (e) => {
      const item = e.target.closest('.todo-item');
      if (!item) return;
      const id = item.dataset.id;

      // Checkbox click
      if (e.target.closest('.checkbox-circle')) {
        this.onToggle(id);
        return;
      }

      // Delete click
      if (e.target.closest('.todo-delete')) {
        // Add exit animation, then delete
        item.classList.add('removing');
        item.addEventListener('animationend', () => {
          this.onDelete(id);
        }, { once: true });
        return;
      }
    });

    // Filter buttons (desktop + mobile)
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.setActiveFilter(filter);
        this.onFilter(filter);
      });
    });

    // Clear completed
    document.getElementById('clear-completed').addEventListener('click', () => {
      this.onClearCompleted();
    });
  }

  /**
   * Render the todo list
   * @param {Array} todos - Filtered todos to render
   */
  render(todos) {
    this.listEl.innerHTML = '';

    if (todos.length === 0) {
      const emptyEl = document.createElement('li');
      emptyEl.className = 'todo-empty';
      emptyEl.textContent = this.currentFilter === 'all' 
        ? 'No todos yet. Add one above!' 
        : `No ${this.currentFilter} todos`;
      this.listEl.appendChild(emptyEl);
      return;
    }

    todos.forEach((todo, index) => {
      const li = this.createTodoItem(todo, index);
      this.listEl.appendChild(li);
    });
  }

  /**
   * Create a single todo list item
   * @param {Object} todo
   * @param {number} index
   * @returns {HTMLElement}
   */
  createTodoItem(todo, index) {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;
    li.dataset.index = index;
    li.draggable = true;
    li.setAttribute('role', 'listitem');

    // Checkbox
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox-circle';
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', todo.completed);
    checkbox.setAttribute('tabindex', '0');
    checkbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.onToggle(todo.id);
      }
    });

    // Text
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete';
    deleteBtn.setAttribute('aria-label', `Delete ${todo.text}`);
    deleteBtn.innerHTML = '<img src="/images/icon-cross.svg" alt="">';

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    return li;
  }

  /**
   * Update the items left counter
   * @param {number} count
   */
  updateCount(count) {
    this.itemsLeftEl.textContent = `${count} item${count !== 1 ? 's' : ''} left`;
  }

  /**
   * Set the active filter button (syncs desktop + mobile)
   * @param {string} filter
   */
  setActiveFilter(filter) {
    this.currentFilter = filter;
    
    // Update all filter buttons (desktop + mobile)
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  }
}
