// ============================================
// SERVER.JS — Jantung Back-End Dashboard GZ
// ============================================

// 1. IMPORTS (Senjata Utama)
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 2. MIDDLEWARE (Wajib di Atas Routes!)
app.use(cors()); 
app.use(express.json()); // Biar server bisa baca data JSON yang dikirim Frontend

// 3. SIAPIN FOLDER UPLOADS
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); 
}
app.use('/uploads', express.static(uploadDir));

// 4. KONEKSI KE DATABASE
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_dashboard_chill'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Gagal nyambung ke database:', err);
        return;
    }
    console.log('✅ Berhasil nyambung ke MySQL Database db_dashboard_chill!');
});

// 5. SETTING MULTER (Tukang Simpen File)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ============================================
// 6. ROUTES - AUTHENTICATION (Login & Register)
// ============================================

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    
    db.query(query, [username, email, password], (err, result) => {
        if (err) return res.status(400).json({ message: 'Gagal! Username atau Email mungkin sudah dipakai.' });
        res.status(201).json({ message: 'Akun berhasil dibuat! Silakan Login.' });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Terjadi kesalahan di server.' });

        if (results.length > 0) {
            res.status(200).json({ 
                message: 'Login sukses!', 
                userId: results[0].id, // Kirim ID buat kebutuhan To-Do List
                user: results[0].username,
                profile_pic: results[0].profile_pic
            });
        } else {
            res.status(401).json({ message: 'Username atau Password salah!' });
        }
    });
});

// ============================================
// 7. ROUTES - PROFILE (Upload Foto)
// ============================================

app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
    const username = req.body.username;
    if (!req.file) return res.status(400).json({ message: 'Tidak ada file!' });

    const imagePath = 'http://localhost:3000/uploads/' + req.file.filename;
    const query = 'UPDATE users SET profile_pic = ? WHERE username = ?';
    
    db.query(query, [imagePath, username], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error database' });
        res.status(200).json({ message: 'Foto update!', profile_pic: imagePath });
    });
});

// ============================================
// 8. ROUTES - TO-DO LIST (BARU!)
// ============================================

// Ambil To-Do berdasarkan User ID
app.get('/api/todos/:userId', (req, res) => {
    const query = 'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC';
    db.query(query, [req.params.userId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Tambah To-Do
app.post('/api/todos', (req, res) => {
    const { user_id, task } = req.body;
    const query = 'INSERT INTO todos (user_id, task) VALUES (?, ?)';
    db.query(query, [user_id, task], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, task, status: 'pending' });
    });
});

// Update Status To-Do (Checklist)
app.put('/api/todos/:id', (req, res) => {
    const { status } = req.body;
    const query = 'UPDATE todos SET status = ? WHERE id = ?';
    db.query(query, [status, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Updated');
    });
});

// Hapus To-Do
app.delete('/api/todos/:id', (req, res) => {
    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Deleted');
    });
});

// 9. NYALAIN SERVER (Selalu di Paling Bawah)
app.listen(PORT, () => {
    console.log(`🚀 Server nyala di: http://localhost:${PORT}`);
});