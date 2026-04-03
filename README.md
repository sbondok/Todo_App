# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

This project is part of the **Frontend Development Diploma** at [Almdrasa.com](https://almdrasa.com/) — the final capstone project of the JavaScript track.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

### Screenshot

![Todo App — Dark Theme](./preview.jpg)

### Links

- Solution URL: [GitHub Repository](https://github.com/sbondok/Todo_App)
- Live Site URL: [Live Demo](https://sbondok.github.io/Todo_App/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties (design tokens)
- Flexbox
- Mobile-first responsive workflow
- Vanilla JavaScript (ES6+ modules)
- [Vite](https://vite.dev/) — Lightning-fast build tool
- [Josefin Sans](https://fonts.google.com/specimen/Josefin+Sans) — Google Fonts
- HTML5 Drag and Drop API
- localStorage for data persistence

### What I learned

This capstone project brought together everything I've learned throughout the JavaScript track at Almdrasa. Here are some key highlights:

**Modular Architecture** — Structuring a vanilla JS project with clean separation of concerns using ES6 modules:

```
src/
├── main.js              # Entry point — wires everything together
├── modules/
│   ├── todoStore.js     # State management + localStorage
│   ├── todoRenderer.js  # DOM rendering + event delegation
│   ├── themeToggle.js   # Dark/light theme toggle
│   └── dragDrop.js      # HTML5 drag & drop + touch support
└── styles/
    ├── base.css         # Reset, tokens, typography
    ├── theme.css        # Dark/light CSS variables
    ├── layout.css       # Container, header, responsive
    ├── components.css   # Todo items, input, filters
    └── animations.css   # Transitions, micro-animations
```

**CSS Custom Properties for Theming** — Using CSS variables to create a seamless dark/light mode toggle without a single line of JavaScript manipulating styles directly:

```css
[data-theme="dark"] {
  --bg-body: hsl(235, 21%, 11%);
  --bg-card: hsl(235, 24%, 19%);
  --color-text: hsl(234, 39%, 85%);
}

[data-theme="light"] {
  --bg-body: hsl(0, 0%, 98%);
  --bg-card: hsl(0, 0%, 100%);
  --color-text: hsl(235, 19%, 35%);
}
```

**Event Delegation** — Instead of attaching individual event listeners to every todo item, I used event delegation on the parent list element. This is far more efficient and works seamlessly as items are dynamically added and removed:

```js
this.listEl.addEventListener('click', (e) => {
  const item = e.target.closest('.todo-item');
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.closest('.checkbox-circle')) {
    this.onToggle(id);
  }
  if (e.target.closest('.todo-delete')) {
    item.classList.add('removing');
    item.addEventListener('animationend', () => this.onDelete(id), { once: true });
  }
});
```

**Gradient Border Trick** — Creating a gradient border on the checkbox hover by layering backgrounds:

```css
.todo-item:not(.completed) .checkbox-circle:hover {
  background: linear-gradient(var(--bg-card), var(--bg-card)) padding-box,
              var(--gradient-check) border-box;
  border: 1px solid transparent;
}
```

### Continued development

Areas I plan to continue focusing on in future projects:

- **Accessibility (a11y)** — Deepening ARIA attribute usage and keyboard navigation patterns
- **Framework-based development** — Rebuilding this project in React or Vue to compare architectural approaches
- **Testing** — Adding unit tests with Vitest and end-to-end tests with Playwright
- **Advanced animations** — Exploring FLIP technique and Web Animations API for smoother list reorder transitions
- **Backend integration** — Connecting to a REST API or Firebase for cloud-synced todos

### Useful resources

- [MDN Web Docs — HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) — Essential reference for implementing native drag and drop without external libraries.
- [CSS Tricks — A Complete Guide to Custom Properties](https://css-tricks.com/a-complete-guide-to-custom-properties/) — Helped solidify my understanding of CSS variables and theming strategies.
- [Vite Documentation](https://vite.dev/guide/) — Clear and concise docs that made setting up the build tool straightforward.
- [Almdrasa JavaScript Course](https://almdrasa.com/) — The comprehensive JavaScript track that provided the foundation for this project.

### AI Collaboration

- **Tools used**: Claude (via Gemini Antigravity IDE assistant)
- **How I used it**: I used AI as a pair-programming partner to scaffold the modular architecture, generate the initial CSS design tokens from the style guide, and implement the drag-and-drop module. The AI helped translate the Figma design into pixel-accurate CSS.
- **What worked well**: Architecture planning, CSS variable setup, and cross-referencing against the design screenshots were highly productive with AI assistance.
- **What I learned**: AI is excellent at accelerating boilerplate and architectural decisions, but understanding the underlying code and being able to debug/modify it independently remains essential.

## Author

- Name — **Elsayed Bondok (sbondok)**
- GitHub — [@sbondok](https://github.com/sbondok)
- LinkedIn — [in/sbondok](https://www.linkedin.com/in/sbondok/)
- Frontend Mentor — [@sbondok](https://www.frontendmentor.io/profile/sbondok)

## Acknowledgments

A heartfelt thank you to:

- **[Almdrasa.com](https://almdrasa.com/)** — For providing an outstanding Frontend Development Diploma program. The JavaScript track has been a transformative learning experience, and this capstone project is a testament to the quality of their curriculum and instructors.
- **[Frontend Mentor](https://www.frontendmentor.io/)** — For creating this beautifully designed challenge that pushed me to apply real-world skills in responsive design, theming, and interactive UI development.
- The Almdrasa community of fellow learners who share the same passion for continuous growth and professional development.
