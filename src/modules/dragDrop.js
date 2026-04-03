/**
 * DragDrop — Native HTML5 drag & drop reordering module
 */

export class DragDrop {
  /**
   * @param {HTMLElement} listEl - The <ul> todo list element
   * @param {Function} onReorder - Callback(fromIndex, toIndex) when items are reordered
   */
  constructor(listEl, onReorder) {
    this.listEl = listEl;
    this.onReorder = onReorder;
    this.draggedItem = null;
    this.draggedIndex = -1;

    this.initEventListeners();
  }

  /**
   * Set up drag event listeners via delegation
   */
  initEventListeners() {
    this.listEl.addEventListener('dragstart', (e) => this.handleDragStart(e));
    this.listEl.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.listEl.addEventListener('dragenter', (e) => this.handleDragEnter(e));
    this.listEl.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    this.listEl.addEventListener('drop', (e) => this.handleDrop(e));
    this.listEl.addEventListener('dragend', (e) => this.handleDragEnd(e));

    // Touch support for mobile
    this.initTouchDrag();
  }

  handleDragStart(e) {
    const item = e.target.closest('.todo-item');
    if (!item) return;

    this.draggedItem = item;
    this.draggedIndex = parseInt(item.dataset.index, 10);

    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.draggedIndex.toString());

    // Add dragging visual
    requestAnimationFrame(() => {
      item.classList.add('dragging');
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragEnter(e) {
    e.preventDefault();
    const item = e.target.closest('.todo-item');
    if (item && item !== this.draggedItem) {
      item.classList.add('drag-over');
    }
  }

  handleDragLeave(e) {
    const item = e.target.closest('.todo-item');
    if (item) {
      item.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    const targetItem = e.target.closest('.todo-item');
    if (!targetItem || targetItem === this.draggedItem) return;

    const toIndex = parseInt(targetItem.dataset.index, 10);

    // Remove drag-over styling
    targetItem.classList.remove('drag-over');

    // Call reorder callback
    if (this.draggedIndex !== -1 && toIndex !== -1 && this.draggedIndex !== toIndex) {
      this.onReorder(this.draggedIndex, toIndex);
    }
  }

  handleDragEnd() {
    // Clean up all drag states
    if (this.draggedItem) {
      this.draggedItem.classList.remove('dragging');
    }
    this.listEl.querySelectorAll('.drag-over').forEach(item => {
      item.classList.remove('drag-over');
    });
    this.draggedItem = null;
    this.draggedIndex = -1;
  }

  /**
   * Initialize touch-based drag and drop for mobile
   */
  initTouchDrag() {
    let touchStartY = 0;
    let touchItem = null;
    let clone = null;
    let itemHeight = 0;
    let allItems = [];
    let originalIndex = -1;
    let currentOverIndex = -1;

    this.listEl.addEventListener('touchstart', (e) => {
      const item = e.target.closest('.todo-item');
      if (!item) return;

      // Don't intercept checkbox or delete button touches
      if (e.target.closest('.checkbox-circle') || e.target.closest('.todo-delete')) return;

      touchItem = item;
      touchStartY = e.touches[0].clientY;
      originalIndex = parseInt(item.dataset.index, 10);
      allItems = Array.from(this.listEl.querySelectorAll('.todo-item'));
      itemHeight = item.offsetHeight;

      // Long press to initiate drag
      this.touchTimer = setTimeout(() => {
        if (!touchItem) return;

        touchItem.classList.add('dragging');

        // Create a visual clone
        clone = touchItem.cloneNode(true);
        clone.style.cssText = `
          position: fixed;
          z-index: 1000;
          pointer-events: none;
          opacity: 0.8;
          width: ${touchItem.offsetWidth}px;
          left: ${touchItem.getBoundingClientRect().left}px;
          top: ${e.touches[0].clientY - itemHeight / 2}px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          transition: none;
        `;
        document.body.appendChild(clone);
      }, 200);
    }, { passive: true });

    this.listEl.addEventListener('touchmove', (e) => {
      if (!touchItem || !clone) return;
      e.preventDefault();

      const touchY = e.touches[0].clientY;
      clone.style.top = `${touchY - itemHeight / 2}px`;

      // Determine which item we're over
      allItems.forEach((item, i) => {
        if (item === touchItem) return;
        const rect = item.getBoundingClientRect();

        if (touchY > rect.top && touchY < rect.bottom) {
          item.classList.add('drag-over');
          currentOverIndex = i;
        } else {
          item.classList.remove('drag-over');
        }
      });
    }, { passive: false });

    this.listEl.addEventListener('touchend', () => {
      clearTimeout(this.touchTimer);

      if (clone) {
        clone.remove();
        clone = null;
      }

      if (touchItem) {
        touchItem.classList.remove('dragging');
      }

      // Remove all drag-over states
      allItems.forEach(item => item.classList.remove('drag-over'));

      if (originalIndex !== -1 && currentOverIndex !== -1 && originalIndex !== currentOverIndex) {
        this.onReorder(originalIndex, currentOverIndex);
      }

      touchItem = null;
      originalIndex = -1;
      currentOverIndex = -1;
    }, { passive: true });
  }
}
