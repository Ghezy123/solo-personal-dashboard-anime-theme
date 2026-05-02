// ============================================
// TO-DO LIST (SUPABASE DIRECT VERSION)
// ============================================

function initTodoList() {
    console.log("🛠️ To-Do List Engine: ON (Direct to Supabase)");

    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    
    // Ambil ID User dari localStorage
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error("User ID tidak ditemukan. Silakan login dulu!");
        return;
    }

    // --- FUNGSI TAMPILIN DATA (READ) ---
    async function renderTodos() {
        if (!todoList) return;

        try {
            // Memanggil global client dari window
            const { data: todos, error } = await window.supabaseClient
                .from('todos')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            todoList.innerHTML = '';

            todos.forEach((todo) => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.status === 'completed' ? 'completed' : ''}`;

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
            console.error("❌ Gagal ambil data dari Supabase:", err.message);
        }
    }

    // --- FUNGSI TAMBAH (CREATE) ---
    async function addTodo() {
        const text = todoInput.value.trim();
        if (!text) return;

        try {
            const { error } = await window.supabaseClient
                .from('todos')
                .insert([
                    { user_id: userId, task: text, status: 'pending' }
                ]);

            if (error) throw error;

            todoInput.value = '';
            renderTodos(); 
        } catch (err) {
            alert("Gagal nambah tugas: " + err.message);
        }
    }

    // --- FUNGSI UPDATE STATUS (UPDATE) ---
    window.toggleTodo = async (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        
        try {
            const { error } = await window.supabaseClient
                .from('todos')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            renderTodos();
        } catch (err) {
            console.error("Gagal update status:", err.message);
        }
    };

    // --- FUNGSI HAPUS (DELETE) ---
    window.deleteTodo = async (id) => {
        if (!confirm("Hapus tugas ini?")) return;

        try {
            const { error } = await window.supabaseClient
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            renderTodos();
        } catch (err) {
            console.error("Gagal hapus tugas:", err.message);
        }
    };

    // --- EVENT LISTENERS ---
    if (addBtn) addBtn.onclick = addTodo;
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });
    }

    renderTodos();
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}