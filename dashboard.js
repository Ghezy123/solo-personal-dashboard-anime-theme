// ============================================
// DASHBOARD.JS — Personal Web Dashboard Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation(); // Fungsi navigasi SPA baru
  highlightToday(); // Fungsi highlight jadwal baru
  initClock();
  initGreeting();
  initTodoList();
  initQuotes();
  initMusicPlayer();
});

// ============================================
// NAVIGATION & SCHEDULE LOGIC (NEW)
// ============================================
function initNavigation() {
  const navHome = document.getElementById('nav-home');
  const navSchedule = document.getElementById('nav-schedule');
  
  const viewHome = document.getElementById('view-home');
  const viewSchedule = document.getElementById('view-schedule');

  function switchPage(page) {
    if (page === 'home') {
      viewHome.style.display = 'flex';
      viewSchedule.style.display = 'none';
      navHome.classList.add('active');
      navSchedule.classList.remove('active');
    } else if (page === 'schedule') {
      viewHome.style.display = 'none';
      viewSchedule.style.display = 'flex';
      navSchedule.classList.add('active');
      navHome.classList.remove('active');
      
      // Pastikan highlight diperbarui tiap kali halaman jadwal dibuka
      highlightToday(); 
    }
  }

  if (navHome) {
    navHome.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage('home');
    });
  }

  if (navSchedule) {
    navSchedule.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage('schedule');
    });
  }
}

function highlightToday() {
  // Dapatkan hari ini (0 = Minggu, 1 = Senin, 2 = Selasa, dst)
  const currentDay = new Date().getDay();
  
  // Hapus semua class 'today-active' terlebih dahulu agar bersih
  document.querySelectorAll('.day-card').forEach(card => {
    card.classList.remove('today-active');
  });

  // Jika hari ini Senin (1) sampai Jumat (5), tambahkan efek highlight
  if (currentDay >= 1 && currentDay <= 5) {
    const todayCard = document.getElementById(`day-${currentDay}`);
    if (todayCard) {
      todayCard.classList.add('today-active');
    }
  }
}

// ============================================
// DIGITAL CLOCK
// ============================================
function initClock() {
  const clockElement = document.getElementById('clock');
  const dateElement = document.getElementById('date-display');

  function updateClock() {
    const now = new Date();

    // Format time: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;

    // Format date
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    dateElement.textContent = now.toLocaleDateString('id-ID', options);
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// ============================================
// DYNAMIC GREETING
// ============================================
function initGreeting() {
  const greetingElement = document.getElementById('greeting');

  function updateGreeting() {
    const hour = new Date().getHours();
    let greeting;

    if (hour >= 5 && hour < 12) {
      greeting = 'Selamat Pagi ☀️';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Selamat Siang 🌤️';
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Selamat Sore 🌅';
    } else {
      greeting = 'Selamat Malam 🌙';
    }

    greetingElement.textContent = greeting;
  }

  updateGreeting();
  // Update greeting every minute
  setInterval(updateGreeting, 60000);
}

// ============================================
// TO-DO LIST
// ============================================
function initTodoList() {
  const todoInput = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-todo-btn');
  const todoList = document.getElementById('todo-list');

  // Load from localStorage
  let todos = JSON.parse(localStorage.getItem('dashboard-todos')) || [];

  function saveTodos() {
    localStorage.setItem('dashboard-todos', JSON.stringify(todos));
  }

  function renderTodos() {
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

  // Event Listeners
  if(addBtn) addBtn.addEventListener('click', addTodo);

  if(todoInput) {
    todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTodo();
    });
  }

  if(todoList) {
    todoList.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);

      if (e.target.type === 'checkbox') {
        toggleTodo(index);
      } else if (e.target.classList.contains('delete-btn')) {
        deleteTodo(index);
      }
    });
  }

  // Initial render
  renderTodos();
}

// ============================================
// ANIME QUOTES
// ============================================
function initQuotes() {
  const quoteElement = document.getElementById('anime-quote');
  const sourceElement = document.getElementById('quote-source');
  const newQuoteBtn = document.getElementById('new-quote-btn');

  if(!quoteElement || !sourceElement || !newQuoteBtn) return;

  const quotes = [
    { text: "Orang tidak akan pernah bisa menang sendirian. Itulah kenapa kita memiliki teman.", source: "Natsu Dragneel — Fairy Tail" },
    { text: "Jika kamu tidak menyukai takdirmu, jangan terima saja. Berjuanglah untuk mengubahnya sesuai keinginanmu.", source: "Naruto Uzumaki — Naruto" },
    { text: "Tidak peduli seberapa dalam malam, fajar pasti akan datang.", source: "Brook — One Piece" },
    { text: "Yang terkuat bukanlah yang tidak pernah menangis, tapi yang tetap tersenyum setelah menangis.", source: "Erza Scarlet — Fairy Tail" },
    { text: "Mimpi itu tidak akan lari. Yang lari adalah dirimu sendiri.", source: "Sei Shonagon — The Pillow Book" },
    { text: "Manusia yang tidak menghargai kehidupan tidak layak memilikinya.", source: "L Lawliet — Death Note" },
    { text: "Ketika ada pertemuan, pasti ada perpisahan. Tapi perpisahan hanyalah jembatan menuju pertemuan berikutnya.", source: "Jiraiya — Naruto" },
    { text: "Tidak ada yang namanya kebetulan di dunia ini. Yang ada hanyalah takdir.", source: "Yuuko Ichihara — xxxHolic" },
    { text: "Kegagalan adalah ibu dari kesuksesan. Selama kamu terus mencoba, kamu tidak pernah benar-benar kalah.", source: "Might Guy — Naruto" },
    { text: "Hidup adalah tentang membuat pilihan. Pilihan yang salah pun tetap lebih baik daripada tidak memilih sama sekali.", source: "Lelouch Lamperouge — Code Geass" },
    { text: "Kamu tidak bisa membantu orang lain kalau kamu sendiri tidak bahagia.", source: "Tanjiro Kamado — Demon Slayer" },
    { text: "Masa lalu adalah masa lalu. Tidak ada gunanya terus memikirkannya. Yang bisa kita lakukan adalah terus melangkah maju.", source: "Edward Elric — Fullmetal Alchemist" },
    { text: "Keberanian bukan berarti tidak takut. Keberanian adalah tetap maju meskipun ketakutan.", source: "Midoriya Izuku — My Hero Academia" },
    { text: "Dalam dunia ini, ada hal-hal yang tidak bisa kau lindungi sendirian. Itulah mengapa kita saling membutuhkan.", source: "Kirito — Sword Art Online" },
    { text: "Jangan pernah meremehkan tekad seseorang yang berjuang untuk melindungi orang yang dicintainya.", source: "Ichigo Kurosaki — Bleach" }
  ];

  let lastIndex = -1;

  function displayQuote() {
    let randomIndex;
    
    do {
      randomIndex = Math.floor(Math.random() * quotes.length);
    } while (randomIndex === lastIndex && quotes.length > 1);
    
    lastIndex = randomIndex;
    const quote = quotes[randomIndex];

    quoteElement.style.opacity = '0';
    sourceElement.style.opacity = '0';

    setTimeout(() => {
      quoteElement.textContent = `"${quote.text}"`;
      sourceElement.textContent = `— ${quote.source}`;
      quoteElement.style.opacity = '1';
      sourceElement.style.opacity = '1';
    }, 200);
  }

  quoteElement.style.transition = 'opacity 0.2s ease';
  sourceElement.style.transition = 'opacity 0.2s ease';

  newQuoteBtn.addEventListener('click', displayQuote);
  displayQuote();
}

// ============================================
// MUSIC PLAYER (UI Demo)
// ============================================
function initMusicPlayer() {
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');

  if(!playBtn) return;

  let isPlaying = false;

  const tracks = [
    { title: 'Lo-Fi Chill Beats', artist: 'Anime Vibes Radio' },
    { title: 'Peaceful Morning', artist: 'Studio Ghibli OST' },
    { title: 'Night Drive', artist: 'City Pop Mix' },
    { title: 'Rainy Day Café', artist: 'Relaxing BGM' },
    { title: 'Summer Festival', artist: 'Japanese Traditional' }
  ];

  let currentTrack = 0;

  function updateTrackDisplay() {
    trackTitle.textContent = tracks[currentTrack].title;
    trackArtist.textContent = tracks[currentTrack].artist;
  }

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  });

  prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    updateTrackDisplay();
  });

  nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    updateTrackDisplay();
  });

  volumeSlider.addEventListener('input', (e) => {
    console.log('Volume:', e.target.value);
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}