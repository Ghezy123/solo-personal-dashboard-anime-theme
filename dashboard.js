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
    { text: "Jangan pernah meremehkan tekad seseorang yang berjuang untuk melindungi orang yang dicintainya.", source: "Ichigo Kurosaki — Bleach" },
    { text: "Kerja keras tidak akan mengkhianatimu, tapi impian bisa mengkhianatimu jika kamu tidak bekerja keras.", source: "Hachiman Hikigaya — Oregairu" },
    { text: "Jika kamu punya waktu untuk memikirkan akhir yang indah, maka hiduplah dengan indah sampai akhir.", source: "Sakata Gintoki — Gintama" },
    { text: "Mengetahui rasanya sakit adalah alasan mengapa kita berusaha untuk baik kepada orang lain.", source: "Naruto Uzumaki — Naruto" },
    { text: "Dunia ini tidak sempurna. Tapi ia ada di sana untuk kita, memberikan yang terbaik yang ia bisa.", source: "Roy Mustang — Fullmetal Alchemist" },
    { text: "Jangan memohon sesuatu. Lakukan sendiri, atau kamu tidak akan mendapatkan apa-apa.", source: "Renton Thurston — Eureka Seven" },
    { text: "Seseorang yang tidak bisa mengorbankan sesuatu yang berharga, tidak akan bisa mengubah apa pun.", source: "Armin Arlert — Attack on Titan" },
    { text: "Tidak peduli seberapa kecil peluangnya, itu bukan nol persen.", source: "Sora — No Game No Life" },
    { text: "Kemungkinan yang ada di depan kita hampir tidak terbatas. Itulah alasan kita terus melangkah.", source: "Aether — Genshin Impact" },
    { text: "Ingatlah bahwa setiap orang yang kamu temui takut akan sesuatu, mencintai sesuatu, dan telah kehilangan sesuatu.", source: "Lucy Heartfilia — Fairy Tail" },
    { text: "Berhenti mencoba mencari alasan untuk melakukan sesuatu yang kamu benci. Lakukan saja apa yang kamu suka.", source: "Shinichi Chiaki — Nodame Cantabile" },
    { text: "Kelemahan adalah hal yang memalukan, tapi tetap menjadi lemah jauh lebih memalukan.", source: "Fuegoleon Vermillion — Black Clover" },
    { text: "Batas hanya ada bagi mereka yang sudah berhenti berjuang.", source: "Vegeta — Dragon Ball" },
    { text: "Rasa takut itu perlu untuk evolusi. Rasa takut bahwa seseorang bisa hancur kapan saja.", source: "Aizen Sosuke — Bleach" },
    { text: "Jika kamu tidak bisa menemukan alasan untuk bertarung, maka kamu tidak seharusnya bertarung.", source: "Akame — Akame ga Kill" },
    { text: "Jangan hanya menghitung apa yang telah hilang. Pikirkan apa yang masih kamu miliki.", source: "Jinbe — One Piece" },
    { text: "Lebih baik dipercaya dan dikhianati daripada tidak percaya sama sekali.", source: "Kirito — Sword Art Online" },
    { text: "Perbedaan antara pemula dan master adalah master telah gagal lebih banyak daripada yang pernah dicoba pemula.", source: "Koro-sensei — Assassination Classroom" },
    { text: "Setiap perjalanan dimulai dengan satu langkah kecil. Pastikan langkah itu menuju ke arah yang benar.", source: "Zhongli — Genshin Impact" },
    { text: "Jangan pernah menarik kembali kata-katamu, karena itu adalah jalan ninjamu.", source: "Uzumaki Naruto — Naruto" },
    { text: "Masa depan adalah milik mereka yang percaya pada keindahan mimpi mereka.", source: "Hinata Shoyo — Haikyuu!!" }
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
// MUSIC PLAYER
// ============================================
// ============================================
// MUSIC PLAYER (ACTUAL WORKING VERSION)
// ============================================
function initMusicPlayer() {
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');

  if(!playBtn) return;

  // 1. Bikin mesin pemutar audio
  const audio = new Audio();
  let isPlaying = false;

  // 2. Daftar lagu 
  const tracks = [
    { 
      title: 'Chill Piano Electronic Music - Home', 
      artist: 'Neutrin05', 
      src: 'music/Chill Piano Electronic Music - Home by Neutrin05.mp3' 
    },
    { 
      title: 'Melodic Lofi Chill - Alone', 
      artist: 'Alex Productions', 
      src: 'music/Melodic Lofi Chill - Alone by Alex Productions.mp3' 
    },
    { 
      title: 'Infinity', 
      artist: 'LEMMiNOMusic', 
      src: 'music/@LEMMiNOMusic  - Infinity.mp3' 
    },
    { 
      title: 'Ambient Music - Helen 2', 
      artist: 'Nikos Spiliotis', 
      src: 'music/Ambient Music - Helen 2 by Nikos Spiliotis.mp3' 
    },
    { 
      title: 'Piano Music', 
      artist: 'Jonny Easton', 
      src: 'music/Piano Music - Purpose by Jonny Easton.mp3' 
    },
    { 
      title: 'Chill Day', 
      artist: 'Lakey Inspired', 
      src: 'music/LAKEY INSPIRED - Chill Day.mp3' 
    },
  ];

  let currentTrack = 0;

  // Fungsi buat muat lagu ke mesin
  function loadTrack(index) {
    trackTitle.textContent = tracks[index].title;
    trackArtist.textContent = tracks[index].artist;
    audio.src = tracks[index].src;
    audio.load();
  }

  // Fungsi Play/Pause
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  // Event Listener pas audio beneran jalan/berhenti (biar UI sinkron)
  audio.addEventListener('play', () => {
    isPlaying = true;
    playBtn.textContent = '⏸'; // Ganti icon ke Pause
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    playBtn.textContent = '▶'; // Ganti icon ke Play
  });

  // Otomatis ganti lagu kalau udah habis
  audio.addEventListener('ended', () => {
    nextBtn.click();
  });

  // Fungsi Tombol
  playBtn.addEventListener('click', togglePlay);

  prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if(isPlaying) audio.play(); // Kalau lagi nge-play, langsung lanjut play
  });

  nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if(isPlaying) audio.play();
  });

  // Fungsi Volume Slider (0.0 sampai 1.0)
  if(volumeSlider) {
    audio.volume = volumeSlider.value / 100; // Sesuaikan dengan posisi awal slider
    volumeSlider.addEventListener('input', (e) => { 
      audio.volume = e.target.value / 100;
    });
  }

  // Panggil lagu pertama pas web dibuka
  loadTrack(currentTrack);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================
// WHEEL OF NAMES LOGIC (SPIN)
// ============================================
function initSpinner() {
  const canvas = document.getElementById('spin-wheel');
  if (!canvas) return; // Kalau nggak ada roda, stop biar nggak error
  
  const ctx = canvas.getContext('2d');
  const candidatesArea = document.getElementById('spin-candidates');
  const updateBtn = document.getElementById('update-wheel-btn');
  const spinBtn = document.getElementById('spin-btn');
  const resultText = document.getElementById('spin-result');
  
  let candidates = ["Ghezy", "Temen 1", "Temen 2", "Temen 3", "Temen 4"];
  let currentRotation = 0;
  
  // Warna aesthetic untuk potongan rolet
  const colors = ["#a855f7", "#06b6d4", "#f472b6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"];

  function drawWheel() {
    const numSlices = candidates.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (numSlices === 0) {
      resultText.textContent = "Ketik kandidat di sebelah kiri bro!";
      return;
    }

    for (let i = 0; i < numSlices; i++) {
      // Gambar potongan (slice)
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, i * sliceAngle, (i + 1) * sliceAngle);
      ctx.fill();

      // Gambar batas (border hitam)
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0a0a0f";
      ctx.stroke();

      // Nulis nama kandidat
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px 'Quicksand', sans-serif";
      
      let text = candidates[i];
      if(text.length > 12) text = text.substring(0, 10) + '...'; // Potong kalau kepanjangan
      
      ctx.fillText(text, radius - 15, 5);
      ctx.restore();
    }
  }

  function updateCandidates() {
    const text = candidatesArea.value;
    candidates = text.split('\n').map(c => c.trim()).filter(c => c !== "");
    
    // Kembalikan roda ke posisi awal sebelum menggambar ulang
    canvas.style.transition = 'none';
    canvas.style.transform = `rotate(0deg)`;
    currentRotation = 0;
    
    drawWheel();
    resultText.textContent = candidates.length > 0 ? "Roda siap. Klik SPIN!" : "Roda kosong.";
  }

  function spinWheel() {
    if (candidates.length === 0) return;
    
    spinBtn.disabled = true;
    updateBtn.disabled = true;
    resultText.textContent = "Memutar... 🌪️";

    // Muter minimal 5 kali (1800 derajat) + sudut random biar berhenti acak
    const randomDegree = Math.floor(Math.random() * 360);
    const totalSpin = 1800 + randomDegree;
    currentRotation += totalSpin;

    // Jalanin animasi muter
    canvas.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.2, 1)';
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Tunggu 4 detik (sesuai durasi animasi muter)
   // Tunggu 4 detik (sesuai durasi animasi muter)
    setTimeout(() => {
      const actualRotation = currentRotation % 360;
      const sliceAngle = 360 / candidates.length;
      
      // Rumus nentuin siapa yang ada di atas jarum
      const winningAngle = (360 - actualRotation + 270) % 360;
      const winnerIndex = Math.floor(winningAngle / sliceAngle);

      resultText.innerHTML = `Pemenangnya: <span style="color:var(--accent-secondary); font-size:1.2rem;">${candidates[winnerIndex]}</span> 🎉`;
      spinBtn.disabled = false;
      updateBtn.disabled = false;

      // ============================================
      // EFEK MERCON / CONFETTI (BARU)
      // ============================================
      if (typeof confetti === "function") {
        // Durasi ledakan: 3 detik
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
          // Tembakan dari sudut kiri bawah
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: colors // Pakai warna yang sama kayak rolet lu
          });
          // Tembakan dari sudut kanan bawah
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: colors
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
    }, 4000);
  }

  // Nyambungin tombol HTML dengan fungsi JavaScript
  if(updateBtn) updateBtn.addEventListener('click', updateCandidates);
  if(spinBtn) spinBtn.addEventListener('click', spinWheel);

  // Pas awal loading, gambar rodanya
  if(candidatesArea) candidatesArea.value = candidates.join('\n');
  drawWheel();
}