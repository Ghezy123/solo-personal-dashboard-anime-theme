// ============================================
// DASHBOARD.JS — Personal Web Dashboard Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation(); 
  highlightToday(); 
  initClock();
  initGreeting();
  initTodoList();
  initQuotes();
  initMusicPlayer();
  initSpinner(); // <--- BARU: Menyalakan mesin Spin The Wheel
});

// ============================================
// NAVIGATION & SCHEDULE LOGIC
// ============================================
function initNavigation() {
  const navHome = document.getElementById('nav-home');
  const navSchedule = document.getElementById('nav-schedule');
  const navSpin = document.getElementById('nav-spin'); // Tambahan buat Spin
  
  const viewHome = document.getElementById('view-home');
  const viewSchedule = document.getElementById('view-schedule');
  const viewSpin = document.getElementById('view-spin'); // Tambahan buat Spin

  function switchPage(page) {
    // Sembunyikan semua halaman dulu
    viewHome.style.display = 'none';
    viewSchedule.style.display = 'none';
    viewSpin.style.display = 'none';

    // Hilangkan semua highlight menu
    navHome.classList.remove('active');
    navSchedule.classList.remove('active');
    navSpin.classList.remove('active');

    // Tampilkan halaman dan menu yang sesuai
    if (page === 'home') {
      viewHome.style.display = 'flex';
      navHome.classList.add('active');
    } else if (page === 'schedule') {
      viewSchedule.style.display = 'flex';
      navSchedule.classList.add('active');
      highlightToday(); 
    } else if (page === 'spin') {
      viewSpin.style.display = 'flex';
      navSpin.classList.add('active');
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

  if (navSpin) {
    navSpin.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage('spin');
    });
  }
}

function highlightToday() {
  const currentDay = new Date().getDay();
  
  document.querySelectorAll('.day-card').forEach(card => {
    card.classList.remove('today-active');
  });

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

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if(clockElement) clockElement.textContent = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if(dateElement) dateElement.textContent = now.toLocaleDateString('id-ID', options);
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

    if (hour >= 5 && hour < 12) greeting = 'Selamat Pagi ☀️';
    else if (hour >= 12 && hour < 17) greeting = 'Selamat Siang 🌤️';
    else if (hour >= 17 && hour < 21) greeting = 'Selamat Sore 🌅';
    else greeting = 'Selamat Malam 🌙';

    if(greetingElement) greetingElement.textContent = greeting;
  }

  updateGreeting();
  setInterval(updateGreeting, 60000);
}