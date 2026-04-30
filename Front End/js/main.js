// ============================================
// DASHBOARD.JS — Personal Web Dashboard Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. SETUP IDENTITAS (Nama & Profil)
    const activeUser = localStorage.getItem('activeUser');
    const userId = localStorage.getItem('userId'); // <--- Ambil ID unik user

    // KUNCINYA DI SINI: Nama laci fotonya digabung sama ID (misal: profilePic_1)
    const savedPic = localStorage.getItem(`profilePic_${userId}`); 

    // Update Nama
    if (activeUser) {
        const sidebarName = document.getElementById('display-sidebar-name');
        const greetingName = document.getElementById('display-greeting-name');
        if (sidebarName) sidebarName.textContent = activeUser;
        if (greetingName) greetingName.textContent = activeUser;
    }

    // --- FIX BUG BENTROK: Balikin foto sesuai ID user yang login ---
    if (savedPic) {
        const profileImg = document.querySelector('.avatar img');
        if (profileImg) {
            profileImg.src = savedPic;
        }
    }

    // 2. NYALAIN SEMUA MESIN FITUR
    initNavigation(); 
    highlightToday(); 
    initClock(); // (Sudah include greeting real-time)
    initTodoList();
    
    // Fitur lain (Cek apakah fungsinya ada sebelum dipanggil)
    if (typeof initQuotes === 'function') initQuotes();
    if (typeof initMusicPlayer === 'function') initMusicPlayer();
    if (typeof initSpinner === 'function') initSpinner();
});

// ============================================
// NAVIGATION LOGIC (The Unified Way)
// ============================================
function initNavigation() {
    // 1. Daftar semua ID halaman yang lu punya di HTML
    const pages = ['home', 'schedule', 'spin', 'blockblast'];
    
    pages.forEach(page => {
        const navBtn = document.getElementById(`nav-${page}`);
        
        if (navBtn) {
            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 2. Jalankan fungsi pindah halaman
                showView(`view-${page}`);

                // 3. Update status 'active' di sidebar
                document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
                navBtn.classList.add('active');

                // 4. Khusus Jadwal: Highlight hari ini
                if (page === 'schedule') highlightToday();
            });
        }
    });
}

function showView(viewId) {
    const views = document.querySelectorAll('.view-section');

    views.forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none'; 
    });

    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.classList.add('active');
        
        // --- KUNCI ANTI-MEPET ---
        // Home lu aslinya pake Flex biar kartunya rapi, kita balikin di sini:
        if (viewId === 'view-home') {
            activeView.style.display = 'flex'; 
            activeView.style.flexDirection = 'column'; // Biar tumpukannya bener
            activeView.style.gap = '25px'; // Kasih jarak antar section
        } else {
            activeView.style.display = 'block';
        }
    }

    // Trigger Game
    if (viewId === 'view-blockblast') {
        if (window.initBlockBlitz) window.initBlockBlitz();
    }
}


// ============================================
// SYSTEM UTILITIES (Clock & Greeting)
// ============================================

function initClock() {
    const clock = document.getElementById('clock');
    const dateDisp = document.getElementById('date-display');
    const greetEl = document.getElementById('greeting');
    
    const opt = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const updateAll = () => {
        const now = new Date();
        const hour = now.getHours();

        // 1. Update Jam & Tanggal (Tetap pake textContent biar aman)
        if(clock) clock.textContent = now.toLocaleTimeString('id-ID');
        if(dateDisp) dateDisp.textContent = now.toLocaleDateString('id-ID', opt);

        // 2. Logika Greeting (Pecah Teks & Icon)
        let text = "";
        let icon = "";

        if (hour >= 5 && hour < 12) {
            text = 'Pagi'; icon = '☀️';
        } else if (hour >= 12 && hour < 17) {
            text = 'Siang'; icon = '🌤️';
        } else if (hour >= 17 && hour < 21) {
            text = 'Sore'; icon = '🌅';
        } else {
            text = 'Malam'; icon = '🌙';
        }

        // 3. Output ke HTML (Wajib pake innerHTML karena ada tag <span>)
        if(greetEl) {
            greetEl.innerHTML = `Selamat ${text} <span class="emoji-fix">${icon}</span>`;
        }
    };

    // Jalankan sekali pas start biar gak nunggu 1 detik
    updateAll();

    // Jalankan setiap 1 detik biar sinkron terus
    setInterval(updateAll, 1000);
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

// Tambahkan di dalam main.js lu
const navBlockBlitz = document.getElementById('nav-blockblast');

navBlockBlitz.addEventListener('click', (e) => {
    e.preventDefault();
    showView('view-blockblast'); // Fungsi buat ganti view yang lu punya
    
    // Panggil fungsi inisialisasi game
    if (typeof initBlockBlitz === 'function') {
        initBlockBlitz();
    }
});

function showView(viewId) {
    // 1. Ambil semua elemen yang punya class view-section
    const views = document.querySelectorAll('.view-section');

    // 2. Sembunyiin SEMUANYA dulu
    views.forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none'; 
    });

    // 3. Tampilkan cuma ID yang kita mau
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.classList.add('active');
        activeView.style.display = 'block';
    }

    // 4. Khusus buat Block Blitz, jalankan init cuma pas view-nya aktif
    if (viewId === 'view-blockblast') {
        if (window.initBlockBlitz) {
            window.initBlockBlitz();
        }
    }
}