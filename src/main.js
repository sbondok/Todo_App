/**
 * Main Entry Point
 * Imports all CSS and JS modules, wires everything together
 */

// Styles
import './styles/base.css';
import './styles/theme.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/animations.css';

// Modules
import { TodoStore } from './modules/todoStore.js';
import { TodoRenderer } from './modules/todoRenderer.js';
import { ThemeToggle } from './modules/themeToggle.js';
import { DragDrop } from './modules/dragDrop.js';

/**
 * Initialize the application once DOM is ready
 */
function initApp() {
  // DOM elements
  const listEl = document.getElementById('todo-list');
  const itemsLeftEl = document.getElementById('items-left');
  const inputEl = document.getElementById('todo-input');
  const toggleBtn = document.getElementById('theme-toggle');
  const iconEl = document.getElementById('theme-icon');

  // Current filter state
  let currentFilter = 'all';

  // Initialize Store
  const store = new TodoStore();

  // Update function — renders list & count
  function update() {
    const filtered = store.getFiltered(currentFilter);
    renderer.render(filtered);
    renderer.updateCount(store.getActiveCount());
  }

  // Initialize Renderer
  const renderer = new TodoRenderer({
    listEl,
    itemsLeftEl,
    inputEl,
    onToggle: (id) => {
      store.toggleTodo(id);
      update();
    },
    onDelete: (id) => {
      store.deleteTodo(id);
      update();
    },
    onAdd: (text) => {
      store.addTodo(text);
      update();
    },
    onFilter: (filter) => {
      currentFilter = filter;
      update();
    },
    onClearCompleted: () => {
      store.clearCompleted();
      update();
    },
  });

  // Initialize Theme Toggle
  new ThemeToggle(toggleBtn, iconEl);

  // Initialize Drag & Drop
  new DragDrop(listEl, (fromIndex, toIndex) => {
    store.reorder(fromIndex, toIndex);
    update();
  });

  // Initial render
  update();
}

// Start the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
