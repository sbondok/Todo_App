/**
 * ThemeToggle — Dark/Light theme toggle module
 * Persists to localStorage, respects system preference
 */

const THEME_KEY = 'todo-app-theme';

export class ThemeToggle {
  /**
   * @param {HTMLElement} toggleBtn - The theme toggle button
   * @param {HTMLImageElement} iconEl - The theme icon image
   */
  constructor(toggleBtn, iconEl) {
    this.toggleBtn = toggleBtn;
    this.iconEl = iconEl;
    this.htmlEl = document.documentElement;

    // Initialize theme
    this.theme = this.loadTheme();
    this.applyTheme(this.theme, false);

    // Bind click
    this.toggleBtn.addEventListener('click', () => this.toggle());

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't explicitly set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.theme, true);
      }
    });
  }

  /**
   * Load the saved theme or detect system preference
   * @returns {'dark' | 'light'}
   */
  loadTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Detect system preference
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  /**
   * Toggle between dark and light
   */
  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.theme, true);
    this.saveTheme(this.theme);
  }

  /**
   * Apply theme to DOM
   * @param {'dark' | 'light'} theme
   * @param {boolean} animate - Whether to animate the icon
   */
  applyTheme(theme, animate) {
    this.htmlEl.setAttribute('data-theme', theme);

    // Update icon (use BASE_URL for correct path in production)
    const base = import.meta.env.BASE_URL;
    const iconSrc = theme === 'dark' ? `${base}images/icon-sun.svg` : `${base}images/icon-moon.svg`;
    this.iconEl.src = iconSrc;

    // Animate icon
    if (animate) {
      this.iconEl.classList.remove('spin');
      // Force reflow to restart animation
      void this.iconEl.offsetWidth;
      this.iconEl.classList.add('spin');
    }
  }

  /**
   * Save theme preference to localStorage
   * @param {'dark' | 'light'} theme
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('ThemeToggle: Failed to save to localStorage', e);
    }
  }
}
