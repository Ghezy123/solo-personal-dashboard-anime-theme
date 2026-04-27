// ============================================
// AUTHENTICATION LOGIC (CONNECT KE SERVER MYSQL)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const btnLogin = document.getElementById('btn-show-login');
  const btnRegister = document.getElementById('btn-show-register');
  const formLogin = document.getElementById('login-form');
  const formRegister = document.getElementById('register-form');
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  const alertBox = document.getElementById('auth-alert');

  // Switch ke Register
  btnRegister.addEventListener('click', () => {
    btnLogin.classList.remove('active');
    btnRegister.classList.add('active');
    formLogin.classList.remove('active');
    formRegister.classList.add('active');
    
    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Join the dashboard today";
    alertBox.textContent = "";
  });

  // Switch ke Login
  btnLogin.addEventListener('click', () => {
    btnRegister.classList.remove('active');
    btnLogin.classList.add('active');
    formRegister.classList.remove('active');
    formLogin.classList.add('active');
    
    formTitle.textContent = "Welcome Back";
    formSubtitle.textContent = "Login to access your dashboard";
    alertBox.textContent = "";
  });

  // Function nampilin pesan error/sukses
  function showAlert(msg, isSuccess = false) {
    alertBox.textContent = msg;
    if (isSuccess) {
      alertBox.classList.add('success');
      alertBox.classList.remove('danger');
    } else {
      alertBox.classList.add('danger');
      alertBox.classList.remove('success');
    }
  }

  // ==========================================
  // 1. HANDLE REGISTER
  // ==========================================
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ambil data dari inputan form register
    const username = document.getElementById('reg-user').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-pass').value;
    const passConfirm = document.getElementById('reg-pass-confirm').value;

    // Validasi password kembar
    if (password !== passConfirm) {
      showAlert("Password tidak cocok bro!");
      return;
    }

    try {
      // Ngirim data ke Server Node.js
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Akun berhasil dibuat! Silakan Login.", true);
        
        // Auto pindah ke tab login setelah sukses
        setTimeout(() => {
          btnLogin.click();
          document.getElementById('login-user').value = username;
          // Kosongin input password biar aman
          document.getElementById('reg-pass').value = '';
          document.getElementById('reg-pass-confirm').value = '';
        }, 1500);
      } else {
        // Kalau error dari server (misal: Username/Email udah ada di database)
        showAlert(result.message);
      }
    } catch (error) {
      console.error(error);
      showAlert("Gagal nyambung ke server. Pastiin server Node.js nyala!");
    }
  });

  // ==========================================
  // 2. HANDLE LOGIN
  // ==========================================
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      // KUNCI: Kita pake nama 'result' di sini
      const result = await response.json();

      if (response.ok) {
        showAlert("Login sukses! Masuk ke dashboard...", true);
        
        // PASTIIN: Panggil 'result', bukan 'data'
        localStorage.setItem('userId', result.userId); 
        localStorage.setItem('activeUser', result.user); 
        
        // Pindah halaman
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);

      } else {
        showAlert(result.message);
      }
    } catch (error) {
      console.error("Error Detail:", error); // Biar lu bisa liat error aslinya di F12
      showAlert("Ada masalah di kodingan/koneksi. Cek Console (F12)!");
    }
  });
});