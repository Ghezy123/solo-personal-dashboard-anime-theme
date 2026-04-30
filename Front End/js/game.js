/* ================================================================
   BLOCK BLITZ - GAME LOGIC (DATABASE AS SOURCE OF TRUTH)
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('game-board');
    const shapeOptions = document.getElementById('shape-options');
    const scoreDisplay = document.getElementById('current-score');
    const bestScoreDisplay = document.getElementById('best-score');

    const BOARD_SIZE = 8;
    let boardState = []; 
    let score = 0;
    
    // LOGIKA FIX: Jangan percaya localStorage pas awal, biarkan DB yang jawab
    let bestScore = 0; 

    // Tambah variasi bentuk Vertikal biar gak Horizontal terus
    const SHAPES = [
        { matrix: [[1]], color: '#6366f1' },       // Dot 1x1
        { matrix: [[1]], color: '#6366f1' },       // Dot 1x1 (Double entry biar peluang naik)
        { matrix: [[1, 1]], color: '#22d3ee' },    // Mini 1x2 Horizontal
        { matrix: [[1], [1]], color: '#22d3ee' },  // Mini 1x2 Vertikal
        { matrix: [[1, 1, 1]], color: '#ec4899' }, // H-3
        { matrix: [[1], [1], [1]], color: '#ec4899' }, // V-3
        { matrix: [[1, 1], [1, 0]], color: '#f97316' }, // Mini L
        { matrix: [[1, 1, 1, 1]], color: '#a855f7' }, // H-4
        { matrix: [[1], [1], [1], [1]], color: '#a855f7' }, // V-4
        { matrix: [[1, 1], [1, 1]], color: '#f59e0b' }, // Square 2x2
        { matrix: [[1, 1, 1], [0, 1, 0]], color: '#ef4444' } // T-Shape
];

    async function initGame() {
        createBoard();
        renderNextShapes();
        score = 0;
        updateScore(0);
        
        // --- FIX LOGIKA 1: Sinkronisasi Best Score dari Database ---
        const userId = localStorage.getItem('userId');
        const activeUser = localStorage.getItem('activeUser');

        if (userId) {
            try {
                const res = await fetch('http://localhost:3000/api/leaderboard');
                const data = await res.json();
                
                // Cari data skor lu sendiri di DB
                const myData = data.find(u => u.username === activeUser);
                if (myData) {
                    bestScore = myData.block_blitz_highscore;
                    // Paksa localStorage ikut data DB biar hantu 2160 ilang
                    localStorage.setItem('blockBlitz_bestScore', bestScore);
                } else {
                    bestScore = 0;
                }
            } catch (e) {
                bestScore = localStorage.getItem('blockBlitz_bestScore') || 0;
            }
        }
        bestScoreDisplay.innerText = bestScore;
        
        // Update ranking visual
        updateLeaderboardUI();
    }

    function createBoard() {
        boardElement.innerHTML = '';
        boardState = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('dragover', handleDragOver);
                cell.addEventListener('dragleave', clearPreviews);
                cell.addEventListener('drop', handleDrop);
                boardElement.appendChild(cell);
            }
        }
    }

    function renderNextShapes() {
    shapeOptions.innerHTML = '';
    const cellSize = getComputedStyle(document.documentElement)
                      .getPropertyValue('--block-size').trim() || '50px';

    let selectedShapes = [];
    let atLeastOneFits = false;

    // 1. Pilih 3 balok secara acak terlebih dahulu
    for (let i = 0; i < 3; i++) {
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        selectedShapes.push(randomShape);
    }

    // 2. Simulasi: Apakah ada salah satu dari 3 balok ini yang muat di grid?
    for (const shape of selectedShapes) {
        if (checkIfShapeFitsAnywhere(shape.matrix)) {
            atLeastOneFits = true;
            break;
        }
    }

    // 3. Anti-Skakmat: Jika mustahil ditaruh semua, paksa balok terakhir jadi 1x1
    if (!atLeastOneFits) {
        // Mencari balok 1x1 di dalam array SHAPES sebagai penyelamat
        const saviorShape = SHAPES.find(s => s.matrix.length === 1 && s.matrix[0].length === 1);
        if (saviorShape) {
            selectedShapes[2] = saviorShape; // Timpa balok ketiga
        }
    }

    // 4. Proses Rendering ke UI
    selectedShapes.forEach(shapeData => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('shape-item');
        wrapper.draggable = true;
        wrapper.dataset.shape = JSON.stringify(shapeData);
        wrapper.style.display = 'grid';
        wrapper.style.gridTemplateColumns = `repeat(${shapeData.matrix[0].length}, ${cellSize})`;
        wrapper.style.gridTemplateRows = `repeat(${shapeData.matrix.length}, ${cellSize})`;
        wrapper.style.gap = '4px';

        shapeData.matrix.forEach((row, rIdx) => {
            row.forEach((value, cIdx) => {
                const block = document.createElement('div');
                block.style.width = cellSize;
                block.style.height = cellSize;
                block.style.borderRadius = '4px';
                block.style.backgroundColor = value === 1 ? shapeData.color : 'transparent';
                
                if (value === 1) {
                    block.style.boxShadow = `inset 0 0 5px rgba(0,0,0,0.3)`;
                    block.addEventListener('mousedown', () => {
                        dragOffsetR = rIdx;
                        dragOffsetC = cIdx;
                    });
                }
                wrapper.appendChild(block);
            });
        });

        wrapper.addEventListener('dragstart', handleDragStart);
        wrapper.addEventListener('dragend', handleDragEnd);
        shapeOptions.appendChild(wrapper);
    });

    setTimeout(checkGameOver, 500);
}

function checkIfShapeFitsAnywhere(matrix) {
    // Melakukan scanning ke seluruh sel papan (8x8)
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            // Meminjam logika canPlace yang sudah lu buat
            if (canPlace(r, c, matrix)) {
                return true; // Ditemukan minimal satu posisi yang muat
            }
        }
    }
    return false; // Benar-benar tidak ada ruang yang cukup
}

    function clearPreviews() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('preview', 'preview-invalid');
        });
    }

    function showPreview(targetR, targetC, matrix) {
        clearPreviews();
        const startRow = targetR - dragOffsetR;
        const startCol = targetC - dragOffsetC;
        const canFit = canPlace(startRow, startCol, matrix);
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] === 1) {
                    const currentR = startRow + r;
                    const currentC = startCol + c;
                    const cell = document.querySelector(`.cell[data-row="${currentR}"][data-col="${currentC}"]`);
                    if (cell) cell.classList.add(canFit ? 'preview' : 'preview-invalid');
                }
            }
        }
    }

    function handleDragStart(e) {
        currentDraggedElement = e.target;
        currentDraggedData = JSON.parse(e.target.dataset.shape);
        e.target.style.opacity = '0.5';
    }

    function handleDragEnd(e) {
        e.target.style.opacity = '1';
        clearPreviews();
    }

    function handleDragOver(e) {
        e.preventDefault();
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        if (!isNaN(row) && !isNaN(col)) showPreview(row, col, currentDraggedData.matrix);
    }

    function handleDrop(e) {
        e.preventDefault();
        clearPreviews();
        const startRow = parseInt(e.target.dataset.row) - dragOffsetR;
        const startCol = parseInt(e.target.dataset.col) - dragOffsetC;
        if (canPlace(startRow, startCol, currentDraggedData.matrix)) {
            placeShape(startRow, startCol, currentDraggedData);
            currentDraggedElement.remove(); 
            checkLines(); 
            if (shapeOptions.children.length === 0) {
                renderNextShapes();
            } else {
                setTimeout(checkGameOver, 500);
            }
        }
    }

    function canPlace(row, col, matrix) {
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] === 1) {
                    let targetR = row + r;
                    let targetC = col + c;
                    if (targetR < 0 || targetR >= BOARD_SIZE || targetC < 0 || targetC >= BOARD_SIZE || boardState[targetR][targetC] === 1) return false;
                }
            }
        }
        return true;
    }

    function checkGameOver() {
        const remainingShapes = Array.from(shapeOptions.children).map(el => JSON.parse(el.dataset.shape));
        if (remainingShapes.length === 0) return;

        let movePossible = false;
        for (let shape of remainingShapes) {
            for (let r = 0; r < BOARD_SIZE; r++) {
                for (let c = 0; c < BOARD_SIZE; c++) {
                    if (canPlace(r, c, shape.matrix)) {
                        movePossible = true;
                        break;
                    }
                }
                if (movePossible) break;
            }
            if (movePossible) break;
        }

        if (!movePossible) {
            alert("SKAKMAT! Skor Akhir: " + score);
            // Simpan skor asli ke DB
            saveGameScore(score);
            // Reset papan
            initGame(); 
        }
    }

    function placeShape(row, col, shapeData) {
        const matrix = shapeData.matrix;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] === 1) {
                    let targetR = row + r;
                    let targetC = col + c;
                    boardState[targetR][targetC] = 1;
                    const cell = document.querySelector(`.cell[data-row="${targetR}"][data-col="${targetC}"]`);
                    cell.style.backgroundColor = shapeData.color;
                    cell.style.boxShadow = `0 0 15px ${shapeData.color}`;
                    cell.classList.add('filled');
                }
            }
        }
        updateScore(10 * matrix.flat().filter(v => v === 1).length);
    }

    function checkLines() {
        let rowsToClear = [];
        let colsToClear = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            if (boardState[r].every(cell => cell === 1)) rowsToClear.push(r);
        }
        for (let c = 0; c < BOARD_SIZE; c++) {
            let full = true;
            for (let r = 0; r < BOARD_SIZE; r++) {
                if (boardState[r][c] === 0) { full = false; break; }
            }
            if (full) colsToClear.push(c);
        }
        rowsToClear.forEach(r => clearRow(r));
        colsToClear.forEach(c => clearCol(c));
        if (rowsToClear.length > 0 || colsToClear.length > 0) {
            updateScore((rowsToClear.length + colsToClear.length) * 100);
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
    }

    function clearRow(r) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            boardState[r][c] = 0;
            resetCellVisual(r, c);
        }
    }

    function clearCol(c) {
        for (let r = 0; r < BOARD_SIZE; r++) {
            boardState[r][c] = 0;
            resetCellVisual(r, c);
        }
    }

    function resetCellVisual(r, c) {
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cell.style.backgroundColor = '';
        cell.style.boxShadow = '';
        cell.classList.remove('filled');
    }

    function updateScore(points) {
        score += points;
        scoreDisplay.innerText = score;
        // --- FIX LOGIKA 2: Best Score Real-time ---
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.innerText = bestScore;
            localStorage.setItem('blockBlitz_bestScore', bestScore);
        }
    }

    window.initBlockBlitz = initGame;
    initGame(); 
});

/* ============================================
   GLOBAL SYNC FUNCTIONS (API CALLS)
   ============================================ */

function updateLeaderboardUI() {
    fetch('http://localhost:3000/api/leaderboard')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('game-leaderboard');
            if (!list) return;
            
            list.innerHTML = data.map((user, index) => `
                <li class="rank-item" style="display: flex; justify-content: space-between; margin-top: 5px;">
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">${index + 1}. ${user.username}</span>
                    <span style="color: var(--accent-tertiary); font-weight: bold; font-size: 0.85rem;">${user.block_blitz_highscore}</span>
                </li>
            `).join('') || '<li class="rank-item" style="font-size: 0.8rem; color: var(--text-muted);">Belum ada skor</li>';
        })
        .catch(err => console.error("Leaderboard Error:", err));
}

function saveGameScore(finalScore) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    fetch('http://localhost:3000/api/update-highscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, score: finalScore })
    })
    .then(res => res.json())
    .then(() => updateLeaderboardUI())
    .catch(err => console.error("Simpan Skor Error:", err));
}