// ============================================
// LOGIC SETTINGS (MODAL, UPLOAD FOTO, LOGOUT)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const activeUser = localStorage.getItem('activeUser');
  let savedPic = localStorage.getItem('profilePic');

  // --- 1. RENDER PROFIL (NAMA & FOTO) ---
  function renderProfile() {
    if (activeUser) {
      const sidebarName = document.getElementById('display-sidebar-name');
      const greetingName = document.getElementById('display-greeting-name');
      if (sidebarName) sidebarName.textContent = activeUser;
      if (greetingName) greetingName.textContent = activeUser;
    }
    if (savedPic) {
      const mainAvatar = document.getElementById('profile-img-display');
      const settingsAvatar = document.getElementById('settings-avatar-preview');
      if (mainAvatar) mainAvatar.src = savedPic;
      if (settingsAvatar) settingsAvatar.src = savedPic;
    }
  }
  // Panggil eksekusi pas halaman diload
  renderProfile();

  // --- 2. MODAL SETTINGS (BUKA/TUTUP) ---
  const modal = document.getElementById('settings-modal');
  const btnOpen = document.getElementById('btn-open-settings');
  const btnClose = document.getElementById('btn-close-settings');

  if (btnOpen) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault(); // Biar layar ga lompat ke atas pas diklik
      modal.classList.add('active');
    });
  }
  if (btnClose) {
    btnClose.addEventListener('click', () => modal.classList.remove('active'));
  }
  
  // Nutup modal kalau klik area kosong di luar kotak
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // --- 3. FITUR UPLOAD FOTO ---
  const avatarInput = document.getElementById('avatar-upload');
  if (avatarInput) {
    avatarInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('username', activeUser);

      try {
        const response = await fetch('http://localhost:3000/api/upload-avatar', {
          method: 'POST',
          body: formData 
        });
        const result = await response.json();

        if (response.ok) {
          localStorage.setItem('profilePic', result.profile_pic); 
          savedPic = result.profile_pic; 
          renderProfile(); // Langsung render fotonya di layar
          alert("Gilaa, foto profil lu berhasil diganti! 🔥");
        } else {
          alert("Gagal update: " + result.message);
        }
      } catch (error) {
        console.error(error);
        alert("Server error bro, pastiin Nodemon lu nyala!");
      }
    });
  }

  // --- 4. FITUR LOGOUT ---
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      // Munculin alert konfirmasi biar ga ga sengaja kepencet
      const isSure = confirm("Yakin mau keluar dari dashboard?");
      if(isSure) {
        // Hapus semua tiket
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('activeUser');
        localStorage.removeItem('profilePic');
        
        window.location.href = "login.html";
      }
    });
  }
});