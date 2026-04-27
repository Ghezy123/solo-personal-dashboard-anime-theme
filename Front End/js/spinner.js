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
      // EFEK MERCON / CONFETTI
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

  // ============================================
  // BAGIAN PENYELAMAT (YANG TADI HILANG)
  // ============================================
  // Nyambungin tombol HTML dengan fungsi JavaScript
  if(updateBtn) updateBtn.addEventListener('click', updateCandidates);
  if(spinBtn) spinBtn.addEventListener('click', spinWheel);

  // Pas awal loading, gambar rodanya
  if(candidatesArea) candidatesArea.value = candidates.join('\n');
  drawWheel();
}