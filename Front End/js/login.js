// ============================================
// AUTHENTICATION LOGIC (DIRECT TO SUPABASE)
// ============================================

// 1. KONEKSI SUPABASE (Sudah menggunakan window.supabaseClient agar global)
const supabaseUrl = 'https://wmbvudmycorbanrdnotz.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYnZ1ZG15Y29yYmFucmRub3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjczNjAsImV4cCI6MjA5MzMwMzM2MH0.JKtRCfMzkI3135TqRl0N4fEbDmGTJMuPWmRFaSkwoT4';

// Inisialisasi global
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnLogin = document.getElementById('btn-show-login');
    const btnRegister = document.getElementById('btn-show-register');
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('register-form');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const alertBox = document.getElementById('auth-alert');

    // UI Logic
    btnRegister.addEventListener('click', () => {
        btnLogin.classList.remove('active');
        btnRegister.classList.add('active');
        formLogin.classList.remove('active');
        formRegister.classList.add('active');
        formTitle.textContent = "Create Account";
        formSubtitle.textContent = "Join the dashboard today";
        alertBox.textContent = "";
    });

    btnLogin.addEventListener('click', () => {
        btnRegister.classList.remove('active');
        btnLogin.classList.add('active');
        formRegister.classList.remove('active');
        formLogin.classList.add('active');
        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent = "Login to access your dashboard";
        alertBox.textContent = "";
    });

    function showAlert(msg, isSuccess = false) {
        alertBox.textContent = msg;
        alertBox.className = `alert-message ${isSuccess ? 'success' : 'danger'}`;
    }

    // ==========================================
    // 1. HANDLE REGISTER (Menggunakan supabaseClient)
    // ==========================================
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('reg-user').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-pass').value;
        const passConfirm = document.getElementById('reg-pass-confirm').value;

        if (password !== passConfirm) {
            showAlert("Password tidak cocok bro!");
            return;
        }

        try {
            // Langsung masukin ke tabel 'users' di Supabase
            const { data, error } = await supabaseClient
                .from('users')
                .insert([
                    { username, email, password, block_blitz_highscore: 0 }
                ]);

            if (error) {
                showAlert("Gagal daftar: " + error.message);
            } else {
                showAlert("Akun berhasil dibuat! Silakan Login.", true);
                setTimeout(() => {
                    btnLogin.click();
                    document.getElementById('login-user').value = username;
                }, 1500);
            }
        } catch (err) {
            showAlert("Masalah koneksi ke Supabase!");
        }
    });

    // ==========================================
    // 2. HANDLE LOGIN (Menggunakan supabaseClient)
    // ==========================================
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-user').value.trim();
        const password = document.getElementById('login-pass').value;

        try {
            // Cari user yang username DAN password-nya cocok
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .single(); 

            if (error || !data) {
                showAlert("Username atau Password salah!");
            } else {
                showAlert("Login sukses! Masuk ke dashboard...", true);
                
                localStorage.setItem('userId', data.id); 
                localStorage.setItem('activeUser', data.username); 
                localStorage.setItem('profilePic', data.profile_pic || ''); 
                
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            }
        } catch (err) {
            showAlert("Gagal Login. Cek koneksi internet lu!");
        }
    });
});