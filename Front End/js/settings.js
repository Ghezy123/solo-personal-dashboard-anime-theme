// ============================================
// LOGIC SETTINGS (MODAL, UPLOAD FOTO, LOGOUT)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const activeUser = localStorage.getItem('activeUser');
  const userId = localStorage.getItem('userId');
  let savedPic = localStorage.getItem(`profilePic_${userId}`);

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
          localStorage.setItem(`profilePic_${userId}`, result.profile_pic);  
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
        
        window.location.href = "login.html";
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const btnRemoveAvatar = document.getElementById('btn-remove-avatar');
    const profileImg = document.getElementById('profile-img-display'); // Foto di Sidebar
    const previewImg = document.getElementById('settings-avatar-preview'); // Foto di Settings
    
    // Alamat foto default lu
    const defaultAvatar = 'img/icon kosong.png';

    if (btnRemoveAvatar) {
        btnRemoveAvatar.addEventListener('click', function() {
            // Munculin konfirmasi biar gak typo pencet
            if (confirm('Balikin ke foto profil default?')) {
                
                // 1. Ubah tampilan secara instan
                profileImg.src = defaultAvatar;
                previewImg.src = defaultAvatar;

                // 2. Hapus data dari LocalStorage
                // (Pastiin 'user-avatar' ini namanya sama dengan yang lu pake buat simpen foto)
                localStorage.removeItem('user-avatar');

                alert('Foto profil berhasil di-reset!');
            }
        });
    }
});