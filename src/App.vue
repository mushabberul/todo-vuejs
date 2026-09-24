<script setup>
import { computed, onMounted } from 'vue';
import { useTodoStore } from './stores/todo';

const todoStore = useTodoStore();

onMounted(() => {
  todoStore.getToDos();
});

const todayLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
);

function submitForm() {
  if (todoStore.isEdit) {
    todoStore.updateTodo();
    return;
  }
  todoStore.createTodo();
}
</script>

<template>
  <div class="page">
    <div class="backdrop" aria-hidden="true"></div>

    <main class="shell">
      <header class="hero">
        <p class="eyebrow">{{ todayLabel }}</p>
        <div class="hero-row">
          <h1>To-Do List</h1>
          <div class="stats" aria-live="polite">
            <span class="stat">{{ todoStore.remainingCount }} open</span>
            <span class="stat stat-muted">{{ todoStore.completedCount }} done</span>
          </div>
        </div>
        <p class="lede">Capture the next thing, then tick it off when it is finished.</p>
      </header>

      <form class="composer" @submit.prevent="submitForm">
        <label class="sr-only" for="new-task">{{ todoStore.isEdit ? 'Update task' : 'New task' }}</label>
        <input
          id="new-task"
          v-model="todoStore.todoForm.title"
          type="text"
          class="composer-input"
          :class="{ editing: todoStore.isEdit }"
          :placeholder="todoStore.isEdit ? 'Update this task' : 'What needs doing?'"
          required
        >
        <div class="composer-actions">
          <button v-if="todoStore.isEdit" type="button" class="btn ghost" @click="todoStore.cancelEdit()">
            Cancel
          </button>
          <button type="submit" class="btn primary" :class="{ warning: todoStore.isEdit }">
            {{ todoStore.isEdit ? 'Save changes' : 'Add task' }}
          </button>
        </div>
      </form>

      <div class="filters" role="tablist" aria-label="Filter tasks">
        <button
          v-for="option in todoStore.filterOptions"
          :key="option.id"
          type="button"
          class="filter"
          :class="{ active: todoStore.filter === option.id }"
          role="tab"
          :aria-selected="todoStore.filter === option.id"
          @click="todoStore.setFilter(option.id)"
        >
          {{ option.label }}
        </button>
      </div>

      <section class="board" aria-label="Tasks">
        <p v-if="todoStore.loading" class="empty">Loading your list…</p>
        <p v-else-if="!todoStore.visibleTodos.length" class="empty">
          {{ todoStore.filter === 'completed' ? 'Nothing completed yet.' : 'No tasks in this view.' }}
        </p>
        <ul v-else id="todo-list" class="todo-list">
          <li
            v-for="todo in todoStore.visibleTodos"
            :key="todo.id"
            class="todo-item"
            :class="{
              completed: todo.completed,
              selected: todoStore.editingId === todo.id,
            }"
          >
            <button
              type="button"
              class="check"
              :aria-pressed="todo.completed"
              :aria-label="todo.completed ? 'Mark as open' : 'Mark as done'"
              @click="todoStore.toggleCompleted(todo.id)"
            >
              <i class="fa-solid fa-check"></i>
            </button>
            <p class="title">{{ todo.title }}</p>
            <div class="item-actions">
              <button type="button" class="icon-btn" aria-label="Edit task" @click="todoStore.editTodo(todo.id)">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="icon-btn danger" aria-label="Delete task" @click="todoStore.deleteTodo(todo.id)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style>
:root {
  --ink: #1c1915;
  --ink-soft: #5c564c;
  --paper: #fffaf2;
  --paper-strong: #ffffff;
  --linen: #efe4d2;
  --clay: #c45c26;
  --clay-deep: #9a4318;
  --moss: #2f6b4f;
  --line: rgba(28, 25, 21, 0.1);
  --shadow: 0 24px 60px rgba(73, 48, 24, 0.14);
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
}

body {
  margin: 0;
  color: var(--ink);
  font-family: "Source Sans 3", "Segoe UI", sans-serif;
  background: #d8c7ae;
}

.page {
  position: relative;
  min-height: 100vh;
  padding: 48px 20px 64px;
}

.backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 8%, #f3d2b0 0%, transparent 32%),
    radial-gradient(circle at 88% 0%, #f0c9b4 0%, transparent 28%),
    linear-gradient(180deg, #f6ecdc 0%, #d9c4a6 100%);
  pointer-events: none;
}

.shell {
  position: relative;
  z-index: 1;
  width: min(720px, 100%);
  margin: 0 auto;
  padding: 36px 32px 28px;
  background: var(--paper);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 28px;
  box-shadow: var(--shadow);
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--clay-deep);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

h1 {
  margin: 0;
  font-family: Fraunces, Georgia, serif;
  font-size: clamp(2.1rem, 4vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
}

.lede {
  margin: 12px 0 0;
  color: var(--ink-soft);
  font-size: 1.05rem;
}

.stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat {
  padding: 6px 10px;
  border-radius: 999px;
  background: #f3e4d2;
  color: var(--clay-deep);
  font-size: 0.78rem;
  font-weight: 700;
}

.stat-muted {
  background: var(--linen);
  color: var(--ink-soft);
}

.composer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 10px 10px 10px 18px;
  background: var(--paper-strong);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.composer-input {
  width: 100%;
  min-height: 48px;
  border: 0;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 1.05rem;
  outline: none;
}

.composer-input.editing {
  color: var(--clay-deep);
}

.composer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  border: 0;
  border-radius: 14px;
  padding: 12px 16px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.btn.primary {
  background: var(--clay);
  color: #fffaf4;
}

.btn.primary:hover {
  background: var(--clay-deep);
}

.btn.warning {
  background: #d0891f;
}

.btn.ghost {
  background: transparent;
  color: var(--ink-soft);
}

.filters {
  display: flex;
  gap: 8px;
  margin: 22px 0 16px;
}

.filter {
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 8px 14px;
  background: transparent;
  color: var(--ink-soft);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.filter.active {
  background: #1c1915;
  color: #fff8ee;
}

.board {
  min-height: 280px;
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 58vh;
  overflow: auto;
}

.todo-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 14px 8px;
  border-bottom: 1px dashed var(--line);
}

.todo-item.selected {
  background: #fff4e6;
  border-radius: 14px;
  border-bottom-color: transparent;
  padding-left: 10px;
  padding-right: 10px;
}

.check {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 1.5px solid #c9b79a;
  border-radius: 50%;
  background: transparent;
  color: transparent;
  cursor: pointer;
}

.todo-item.completed .check {
  background: var(--moss);
  border-color: var(--moss);
  color: #f4fff8;
}

.title {
  margin: 0;
  color: var(--ink);
  font-size: 1.02rem;
  line-height: 1.4;
}

.todo-item.completed .title {
  color: #8a8276;
  text-decoration: line-through;
}

.item-actions {
  display: flex;
  gap: 4px;
  opacity: 0.45;
}

.todo-item:hover .item-actions,
.todo-item.selected .item-actions {
  opacity: 1;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
}

.icon-btn:hover {
  background: #f3e8d7;
  color: var(--ink);
}

.icon-btn.danger:hover {
  background: #f8ded4;
  color: #9a2f1a;
}

.empty {
  margin: 48px 0;
  color: var(--ink-soft);
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 640px) {
  .shell {
    padding: 24px 16px;
    border-radius: 22px;
  }

  .hero-row,
  .composer {
    grid-template-columns: 1fr;
    display: grid;
  }

  .hero-row {
    align-items: start;
  }

  .composer-actions {
    justify-content: flex-end;
  }
}
</style>
