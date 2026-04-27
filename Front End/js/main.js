// ============================================
// DASHBOARD.JS — Personal Web Dashboard Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. SETUP IDENTITAS (Nama & Profil)
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
        const sidebarName = document.getElementById('display-sidebar-name');
        const greetingName = document.getElementById('display-greeting-name');
        if (sidebarName) sidebarName.textContent = activeUser;
        if (greetingName) greetingName.textContent = activeUser;
    }

    // 2. NYALAIN SEMUA MESIN FITUR
    initNavigation(); 
    highlightToday(); 
    initClock();
    initGreeting();
    initTodoList();
    
    // Panggil fitur lain (pastikan fungsinya sudah ada di file js lain)
    if (typeof initQuotes === 'function') initQuotes();
    if (typeof initMusicPlayer === 'function') initMusicPlayer();
    if (typeof initSpinner === 'function') initSpinner();
});

// ============================================
// NAVIGATION LOGIC (The DRY Way)
// ============================================
function initNavigation() {
    const pages = ['home', 'schedule', 'spin'];
    
    pages.forEach(page => {
        const navBtn = document.getElementById(`nav-${page}`);
        const viewSection = document.getElementById(`view-${page}`);
        
        if (navBtn && viewSection) {
            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Reset semua halaman & menu
                pages.forEach(p => {
                    document.getElementById(`view-${p}`).style.display = 'none';
                    document.getElementById(`nav-${p}`).classList.remove('active');
                });

                // Aktifkan yang dipilih
                viewSection.style.display = (page === 'schedule') ? 'block' : 'flex';
                navBtn.classList.add('active');
                if (page === 'schedule') highlightToday();
            });
        }
    });
}

// ============================================
// TO-DO LIST LOGIC (DATABASE VERSION)
// ============================================
function initTodoList() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const userId = localStorage.getItem('userId') || 1;

    // FUNGSI TAMPILIN DATA (Dibikin global agar bisa di-refresh fungsi lain)
    window.refreshTodoDisplay = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/todos/${userId}`);
            const data = await response.json();
            todoList.innerHTML = ''; 
            
            data.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.status === 'completed' ? 'done' : ''}`;
                li.innerHTML = `
                    <div class="todo-content" onclick="toggleTodo(${todo.id}, '${todo.status}')">
                        <div class="checkbox"></div>
                        <span>${todo.task}</span>
                    </div>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})">❌</button>
                `;
                todoList.appendChild(li);
            });
        } catch (err) { console.error("Database error:", err); }
    };

    // FUNGSI TAMBAH
    window.addTodo = async () => {
        const task = todoInput.value.trim();
        if (!task) return;
        await fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, task: task })
        });
        todoInput.value = '';
        window.refreshTodoDisplay();
    };

    // Tombol & Enter Listener
    if (addBtn) addBtn.onclick = window.addTodo;
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') window.addTodo();
        });
    }

    window.refreshTodoDisplay();
}

// LOGIKA TOGGLE & DELETE (Wajib Global)
window.toggleTodo = async (id, status) => {
    const newStatus = status === 'pending' ? 'completed' : 'pending';
    await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    window.refreshTodoDisplay();
};

window.deleteTodo = async (id) => {
    if (!confirm("Hapus tugas?")) return;
    await fetch(`http://localhost:3000/api/todos/${id}`, { method: 'DELETE' });
    window.refreshTodoDisplay();
};

// ============================================
// SYSTEM UTILITIES (Clock & Greeting)
// ============================================
function initClock() {
    const clock = document.getElementById('clock');
    const dateDisp = document.getElementById('date-display');
    const opt = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    setInterval(() => {
        const now = new Date();
        if(clock) clock.textContent = now.toLocaleTimeString('id-ID');
        if(dateDisp) dateDisp.textContent = now.toLocaleDateString('id-ID', opt);
    }, 1000);
}

function initGreeting() {
    const greetEl = document.getElementById('greeting');
    const hour = new Date().getHours();
    let text = (hour < 12) ? 'Pagi ☀️' : (hour < 17) ? 'Siang 🌤️' : (hour < 21) ? 'Sore 🌅' : 'Malam 🌙';
    if(greetEl) greetEl.textContent = `Selamat ${text}`;
}

function highlightToday() {
    const currentDay = new Date().getDay();
    document.querySelectorAll('.day-card').forEach(c => c.classList.remove('today-active'));
    const today = document.getElementById(`day-${currentDay}`);
    if (today) today.classList.add('today-active');
}