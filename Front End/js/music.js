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
  // 1. Deteksi kalau lagu abis
  audio.addEventListener('ended', () => {
    console.log("Lagu abis, ganti ke lagu berikutnya...");
    
    // 2. Geser index ke lagu selanjutnya
    currentTrack = (currentTrack + 1) % tracks.length;
    
    // 3. Muat dan putar
    loadTrack(currentTrack);
    audio.play(); // Pakai ini biar langsung start tanpa nunggu tombol di-klik
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
    if (isPlaying) {
      audio.play().catch(error => console.log("Autoplay dicegah browser:", error));
    }
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