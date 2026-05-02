// ============================================
// LOGIC SETTINGS (MODAL, SUPABASE STORAGE, LOGOUT)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const activeUser = localStorage.getItem('activeUser');
    const userId = localStorage.getItem('userId');
    const defaultAvatar = 'img/icon kosong.png';

    // --- 1. RENDER PROFIL ---
    async function renderProfile() {
        // Memanggil window.supabaseClient agar sinkron
        const { data: user, error } = await window.supabaseClient
            .from('users')
            .select('username, profile_pic')
            .eq('id', userId)
            .single();

        if (user) {
            const sidebarName = document.getElementById('display-sidebar-name');
            const greetingName = document.getElementById('display-greeting-name');
            const mainAvatar = document.getElementById('profile-img-display');
            const settingsAvatar = document.getElementById('settings-avatar-preview');

            if (sidebarName) sidebarName.textContent = user.username;
            if (greetingName) greetingName.textContent = user.username;

            const finalPic = user.profile_pic || defaultAvatar;
            if (mainAvatar) mainAvatar.src = finalPic;
            if (settingsAvatar) settingsAvatar.src = finalPic;
            
            localStorage.setItem('activeUser', user.username);
            localStorage.setItem('profilePic', finalPic);
        }
    }
    renderProfile();

    // --- 2. MODAL SETTINGS ---
    const modal = document.getElementById('settings-modal');
    const btnOpen = document.getElementById('btn-open-settings');
    const btnClose = document.getElementById('btn-close-settings');

    if (btnOpen) {
        btnOpen.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    }
    if (btnClose) {
        btnClose.addEventListener('click', () => modal.classList.remove('active'));
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // --- 3. FITUR UPLOAD FOTO ---
    const avatarInput = document.getElementById('avatar-upload');
    if (avatarInput) {
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                // A. Upload file ke Bucket 'avatars' lewat supabaseClient
                const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop()}`;
                const { data: uploadData, error: uploadError } = await window.supabaseClient.storage
                    .from('avatars')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // B. Ambil URL Public-nya
                const { data: urlData } = window.supabaseClient.storage
                    .from('avatars')
                    .getPublicUrl(fileName);

                const publicUrl = urlData.publicUrl;

                // C. Update kolom profile_pic di tabel users
                const { error: updateError } = await window.supabaseClient
                    .from('users')
                    .update({ profile_pic: publicUrl })
                    .eq('id', userId);

                if (updateError) throw updateError;

                renderProfile(); 
                alert("Gilaa, foto profil lu berhasil diganti ke cloud! 🔥");
            } catch (error) {
                console.error(error);
                alert("Gagal update foto: " + error.message);
            }
        });
    }

    // --- 4. FITUR LOGOUT ---
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if(confirm("Yakin mau keluar dari dashboard?")) {
                localStorage.clear(); 
                window.location.href = "login.html";
            }
        });
    }

    // --- 5. HAPUS FOTO (RESET KE DEFAULT) ---
    const btnRemoveAvatar = document.getElementById('btn-remove-avatar');
    if (btnRemoveAvatar) {
        btnRemoveAvatar.addEventListener('click', async () => {
            if (confirm('Balikin ke foto profil default?')) {
                try {
                    const { error } = await window.supabaseClient
                        .from('users')
                        .update({ profile_pic: null })
                        .eq('id', userId);

                    if (error) throw error;
                    renderProfile();
                    alert('Foto profil berhasil di-reset!');
                } catch (error) {
                    alert('Gagal reset foto: ' + error.message);
                }
            }
        });
    }
});