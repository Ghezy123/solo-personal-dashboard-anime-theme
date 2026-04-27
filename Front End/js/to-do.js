// ============================================
// TO-DO LIST (DATABASE & MULTI-USER VERSION)
// ============================================

function initTodoList() {
    console.log("🛠️ To-Do List Engine: ON (Connected to Backend)");

    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    
    // 1. Ambil ID User dari localStorage yang kita dapet pas login
    // Kalo ga ada (buat ngetes), kita default ke user ID 1
    const userId = localStorage.getItem('userId') || 1;

    // --- FUNGSI TAMPILIN DATA (READ) ---
    async function renderTodos() {
        if (!todoList) return;

        try {
            const response = await fetch(`http://localhost:3000/api/todos/${userId}`);
            const todos = await response.json();
            
            todoList.innerHTML = '';

            todos.forEach((todo) => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.status === 'completed' ? 'completed' : ''}`;

                // Kita pake data-id asli dari database (bukan index array)
                li.innerHTML = `
                    <div class="todo-content">
                        <input type="checkbox" ${todo.status === 'completed' ? 'checked' : ''} 
                            onchange="toggleTodo(${todo.id}, '${todo.status}')">
                        <span>${escapeHTML(todo.task)}</span>
                    </div>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})" aria-label="Hapus">✕</button>
                `;
                todoList.appendChild(li);
            });
        } catch (err) {
            console.error("❌ Gagal ngerender list. Pastikan server Node.js nyala!", err);
        }
    }

    // --- FUNGSI TAMBAH (CREATE) ---
    async function addTodo() {
        const text = todoInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_id: userId, 
                    task: text 
                })
            });

            if (response.ok) {
                todoInput.value = '';
                renderTodos(); // Refresh list setelah nambah
            }
        } catch (err) {
            alert("Gagal konek ke server pas nambah tugas!");
        }
    }

    // --- FUNGSI UPDATE STATUS (UPDATE) ---
    window.toggleTodo = async (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        
        try {
            await fetch(`http://localhost:3000/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            renderTodos();
        } catch (err) {
            console.error("Gagal update status!");
        }
    };

    // --- FUNGSI HAPUS (DELETE) ---
    window.deleteTodo = async (id) => {
        // Gak pake confirm biar sat set sat set, atau kasih confirm kalo takut salah pencet
        if (!confirm("Hapus tugas ini?")) return;

        try {
            await fetch(`http://localhost:3000/api/todos/${id}`, {
                method: 'DELETE'
            });
            renderTodos();
        } catch (err) {
            console.error("Gagal menghapus tugas!");
        }
    };

    // --- EVENT LISTENERS ---
    if (addBtn) addBtn.onclick = addTodo;
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });
    }

    // Jalankan render pertama kali pas halaman dibuka
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