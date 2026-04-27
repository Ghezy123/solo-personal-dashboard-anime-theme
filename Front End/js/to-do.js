// ============================================
// TO-DO LIST
// ============================================
function initTodoList() {
  const todoInput = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-todo-btn');
  const todoList = document.getElementById('todo-list');

  let todos = JSON.parse(localStorage.getItem('dashboard-todos')) || [];

  function saveTodos() {
    localStorage.setItem('dashboard-todos', JSON.stringify(todos));
  }

  function renderTodos() {
    if(!todoList) return;
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
        <span>${escapeHTML(todo.text)}</span>
        <button class="delete-btn" data-index="${index}" aria-label="Hapus tugas">✕</button>
      `;
      todoList.appendChild(li);
    });
  }

  function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
  }

  function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  }

  function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }

  if(addBtn) addBtn.addEventListener('click', addTodo);
  if(todoInput) todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });

  if(todoList) {
    todoList.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (e.target.type === 'checkbox') toggleTodo(index);
      else if (e.target.classList.contains('delete-btn')) deleteTodo(index);
    });
  }

  renderTodos();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}