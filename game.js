// ============================================
// WORD LIST (Combined)
// ============================================
const WORDS = [
    // Simple words
    "cat", "dog", "sun", "moon", "tree", "house", "car", "book", "fish", "bird",
    "apple", "banana", "pizza", "cake", "ice cream", "cookie", "bread", "cheese",
    "ball", "hat", "shoe", "shirt", "pants", "glasses", "watch", "ring",
    "chair", "table", "bed", "lamp", "door", "window", "clock", "phone",
    "star", "heart", "cloud", "rain", "snow", "fire", "water", "flower",
    "baby", "king", "queen", "eye", "nose", "mouth", "hand", "foot",
    "cup", "fork", "spoon", "plate", "bowl", "knife", "bottle", "glass",
    "boat", "bus", "bike", "kite", "drum", "bell", "flag", "gift",
    // Medium words
    "airplane", "helicopter", "bicycle", "motorcycle", "train", "submarine",
    "guitar", "piano", "drums", "violin", "microphone", "headphones",
    "computer", "keyboard", "television", "camera", "robot", "rocket",
    "umbrella", "backpack", "wallet", "suitcase", "envelope", "scissors",
    "hamburger", "hotdog", "spaghetti", "pancake", "popcorn", "donut",
    "penguin", "giraffe", "kangaroo", "octopus", "dolphin", "crocodile",
    "astronaut", "pirate", "wizard", "ninja", "zombie", "vampire",
    "diamond", "treasure", "castle", "bridge", "mountain", "volcano",
    "rainbow", "tornado", "lightning", "snowman", "campfire", "waterfall",
    "birthday", "wedding", "concert", "museum", "library", "hospital",
    "butterfly", "ladybug", "dragonfly", "scorpion", "jellyfish", "starfish",
    // Challenging words
    "hibernation", "constellation", "photosynthesis", "camouflage", "ecosystem",
    "democracy", "revolution", "imagination", "celebration", "adventure",
    "skyscraper", "lighthouse", "treehouse", "greenhouse", "warehouse",
    "nightmare", "daydream", "flashback", "time travel", "teleportation",
    "fireworks", "chandelier", "kaleidoscope", "hologram", "reflection",
    "acrobat", "magician", "archaeologist", "photographer", "firefighter",
    "orchestra", "symphony", "choreography", "masterpiece", "sculpture",
    "encryption", "algorithm", "artificial intelligence", "virtual reality",
    "black hole", "solar system", "milky way", "supernova", "asteroid",
    "bungee jumping", "paragliding", "scuba diving", "rock climbing"
];

// ============================================
// GAME STATE
// ============================================
const state = {
    peer: null,
    connections: new Map(),
    peerConnections: new Map(),
    roomCode: null,
    playerName: null,
    playerId: null,
    playerColor: '#6c5ce7',
    isHost: false,
    isDrawing: false,
    currentWord: null,
    currentWordDifficulty: 'easy',
    players: [],
    disconnectedPlayers: new Map(),
    round: 0,
    totalRounds: 6,
    roundTime: 80,
    roundsPerPlayer: 2,
    wordChoices: 3,
    hintsPerRound: 1,
    hintsUsed: 0,
    timerInterval: null,
    hintTimers: [], // Array to store hint timeout IDs
    roundEndTimer: null, // Timeout ID for ending the round
    wordSelectionTimer: null, // Timeout for word selection
    timeLeft: 0,
    currentDrawerIndex: -1,
    guessedPlayers: new Set(),
    roundStartTime: null,
    gameStarted: false,
    hostId: null,
    canvasHistory: [],
    currentHint: ''
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Screens
    lobbyScreen: document.getElementById('lobby-screen'),
    waitingRoomScreen: document.getElementById('waiting-room-screen'),
    gameScreen: document.getElementById('game-screen'),

    // Lobby
    playerNameInput: document.getElementById('player-name'),
    avatarColors: document.querySelectorAll('.avatar-color'),
    customRoomCodeInput: document.getElementById('custom-room-code'),
    createRoomBtn: document.getElementById('create-room-btn'),
    roomCodeInput: document.getElementById('room-code-input'),
    joinRoomBtn: document.getElementById('join-room-btn'),

    // Waiting Room
    displayRoomCode: document.getElementById('display-room-code'),
    copyCodeBtn: document.getElementById('copy-code-btn'),
    playerCount: document.getElementById('player-count'),
    playersList: document.getElementById('players-list'),
    gameSettings: document.getElementById('game-settings'),
    roundsSelect: document.getElementById('rounds-select'),
    timeSelect: document.getElementById('time-select'),
    wordChoicesSelect: document.getElementById('word-choices-select'),
    hintsSelect: document.getElementById('hints-select'),
    startGameBtn: document.getElementById('start-game-btn'),
    leaveRoomBtn: document.getElementById('leave-room-btn'),

    // Game
    roundDisplay: document.getElementById('round-display'),
    wordHint: document.getElementById('word-hint'),
    hintBtn: document.getElementById('hint-btn'),
    timerText: document.getElementById('timer-text'),
    timerProgress: document.getElementById('timer-progress'),
    gamePlayersList: document.getElementById('game-players-list'),
    canvas: document.getElementById('drawing-canvas'),
    drawingTools: document.getElementById('drawing-tools'),
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    sendChatBtn: document.getElementById('send-chat-btn'),
    reactionBtns: document.querySelectorAll('.reaction-btn'),

    // Tools
    colorBtns: document.querySelectorAll('.color-btn'),
    sizeBtns: document.querySelectorAll('.size-btn'),
    eraserBtn: document.getElementById('eraser-btn'),
    fillBtn: document.getElementById('fill-btn'),
    undoBtn: document.getElementById('undo-btn'),
    clearBtn: document.getElementById('clear-btn'),

    // Modals
    wordModal: document.getElementById('word-modal'),
    wordOptions: document.getElementById('word-options'),
    roundOverlay: document.getElementById('round-overlay'),
    overlayTitle: document.getElementById('overlay-title'),
    overlayWord: document.getElementById('overlay-word'),
    overlayScores: document.getElementById('overlay-scores'),
    gameEndModal: document.getElementById('game-end-modal'),
    finalRankings: document.getElementById('final-rankings'),
    playAgainBtn: document.getElementById('play-again-btn'),

    // Toast
    toastContainer: document.getElementById('toast-container')
};

// ============================================
// CANVAS SETUP
// ============================================
const canvas = elements.canvas;
const ctx = canvas.getContext('2d');
let drawing = {
    isDrawing: false,
    color: '#000000',
    size: 4,
    isEraser: false,
    isFilling: false,
    lastX: 0,
    lastY: 0
};

function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const ratio = canvas.width / canvas.height;

    let width = rect.width;
    let height = width / ratio;

    if (height > rect.height - 70) {
        height = rect.height - 70;
        width = height * ratio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

function clearCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
}

function saveCanvasState() {
    if (state.isDrawing) {
        const imageData = canvas.toDataURL();
        state.canvasHistory.push(imageData);
        if (state.canvasHistory.length > 20) {
            state.canvasHistory.shift();
        }
    }
}

function undoCanvas() {
    if (state.canvasHistory.length > 1) {
        state.canvasHistory.pop();
        const imageData = state.canvasHistory[state.canvasHistory.length - 1];
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = imageData;
        broadcast({ type: 'canvas-state', imageData: imageData });
    }
}

function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function drawLine(x1, y1, x2, y2, color, size) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

// Flood fill algorithm
function floodFill(startX, startY, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const startPos = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    // Convert hex to RGB
    const fillR = parseInt(fillColor.slice(1, 3), 16);
    const fillG = parseInt(fillColor.slice(3, 5), 16);
    const fillB = parseInt(fillColor.slice(5, 7), 16);

    // Don't fill if same color
    if (startR === fillR && startG === fillG && startB === fillB) return;

    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set();

    while (stack.length > 0 && stack.length < 100000) {
        const [x, y] = stack.pop();
        const pos = (y * canvas.width + x) * 4;

        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
        if (visited.has(`${x},${y}`)) continue;

        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];

        // Check if pixel matches start color (with tolerance)
        const tolerance = 30;
        if (Math.abs(r - startR) > tolerance ||
            Math.abs(g - startG) > tolerance ||
            Math.abs(b - startB) > tolerance) continue;

        visited.add(`${x},${y}`);

        data[pos] = fillR;
        data[pos + 1] = fillG;
        data[pos + 2] = fillB;
        data[pos + 3] = 255;

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
}

function startDrawing(e) {
    if (!state.isDrawing) return;
    e.preventDefault();

    const coords = getCanvasCoords(e);

    if (drawing.isFilling) {
        floodFill(coords.x, coords.y, drawing.color);
        broadcast({
            type: 'fill',
            x: coords.x,
            y: coords.y,
            color: drawing.color
        });
        saveCanvasState();
        return;
    }

    drawing.isDrawing = true;
    drawing.lastX = coords.x;
    drawing.lastY = coords.y;
}

function draw(e) {
    if (!state.isDrawing || !drawing.isDrawing || drawing.isFilling) return;
    e.preventDefault();

    const coords = getCanvasCoords(e);
    const color = drawing.isEraser ? '#ffffff' : drawing.color;
    const size = drawing.isEraser ? drawing.size * 3 : drawing.size;

    drawLine(drawing.lastX, drawing.lastY, coords.x, coords.y, color, size);

    broadcast({
        type: 'draw',
        data: {
            x1: drawing.lastX,
            y1: drawing.lastY,
            x2: coords.x,
            y2: coords.y,
            color: color,
            size: size
        }
    });

    drawing.lastX = coords.x;
    drawing.lastY = coords.y;
}

function stopDrawing() {
    if (drawing.isDrawing) {
        saveCanvasState();
    }
    drawing.isDrawing = false;
}

// Canvas event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

window.addEventListener('resize', resizeCanvas);

// ============================================
// DRAWING TOOLS
// ============================================
elements.colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawing.color = btn.dataset.color;
        drawing.isEraser = false;
        drawing.isFilling = false;
        elements.eraserBtn.classList.remove('active');
        elements.fillBtn.classList.remove('active');
    });
});

elements.sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawing.size = parseInt(btn.dataset.size);
    });
});

elements.eraserBtn.addEventListener('click', () => {
    drawing.isEraser = !drawing.isEraser;
    drawing.isFilling = false;
    elements.eraserBtn.classList.toggle('active');
    elements.fillBtn.classList.remove('active');
});

elements.fillBtn.addEventListener('click', () => {
    drawing.isFilling = !drawing.isFilling;
    drawing.isEraser = false;
    elements.fillBtn.classList.toggle('active');
    elements.eraserBtn.classList.remove('active');
});

elements.undoBtn.addEventListener('click', () => {
    undoCanvas();
});

elements.clearBtn.addEventListener('click', () => {
    clearCanvas();
    broadcast({ type: 'clear-canvas' });
});

// ============================================
// AVATAR COLOR PICKER
// ============================================
elements.avatarColors.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.avatarColors.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.playerColor = btn.dataset.color;
    });
});

// ============================================
// REACTIONS
// ============================================
elements.reactionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const reaction = btn.dataset.reaction;
        sendReaction(reaction);
    });
});

function sendReaction(reaction) {
    broadcast({
        type: 'reaction',
        reaction: reaction,
        playerName: state.playerName
    });
    showFloatingReaction(reaction);
}

function showFloatingReaction(reaction, x = null, y = null) {
    const el = document.createElement('div');
    el.className = 'floating-reaction';
    el.textContent = reaction;
    el.style.left = (x || Math.random() * 60 + 20) + '%';
    el.style.bottom = '100px';
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 2000);
}

// ============================================
// PEERJS CONNECTION
// ============================================
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function initPeer(peerId = null) {
    return new Promise((resolve, reject) => {
        state.peer = new Peer(peerId, { debug: 1 });

        state.peer.on('open', (id) => {
            console.log('Connected to PeerJS server with ID:', id);
            state.playerId = id;
            resolve(id);
        });

        state.peer.on('error', (err) => {
            console.error('PeerJS error:', err);
            if (err.type === 'unavailable-id') {
                showToast('Room code already in use. Try again.', 'error');
            } else if (err.type === 'peer-unavailable') {
                showToast('Room not found. Check the code.', 'error');
            } else {
                showToast('Connection error: ' + err.type, 'error');
            }
            reject(err);
        });

        state.peer.on('connection', (conn) => {
            handleNewConnection(conn);
        });
    });
}

function connectToHost(hostId) {
    return new Promise((resolve, reject) => {
        const conn = state.peer.connect(hostId, { reliable: true });

        // Fail-safe timeout (increased to 10s)
        const timeout = setTimeout(() => {
            cleanup();
            conn.close();
            reject(new Error('Connection timed out. Host not responding.'));
        }, 10000);

        // Listen for peer-unavailable on the main peer object
        const peerErrorListener = (err) => {
            if (err.type === 'peer-unavailable' && err.message.includes(hostId)) {
                cleanup();
                conn.close();
                reject(new Error('Room code not found.'));
            }
        };
        state.peer.on('error', peerErrorListener);

        // Cleanup helper
        function cleanup() {
            clearTimeout(timeout);
            state.peer.off('error', peerErrorListener);
        }

        conn.on('open', () => {
            cleanup();
            console.log('Connected to host:', hostId);
            state.connections.set(hostId, conn);
            state.hostId = hostId;
            resolve(conn);
        });

        // Handle incoming data from host
        conn.on('data', (data) => {
            handleMessage(data, conn);
        });

        conn.on('error', (err) => {
            cleanup();
            reject(err);
        });

        // Handle immediate closure (e.g. host invalid)
        conn.on('close', () => {
            cleanup();
            // If never opened, this helps catch it
            if (!state.connections.has(hostId)) {
                reject(new Error('Connection closed immediately.'));
            }
        });
    });
}

function handleNewConnection(conn) {
    conn.on('open', () => {
        console.log('New peer connected:', conn.peer);
        state.connections.set(conn.peer, conn);
        if (window.playSound) playSound('join');

        if (state.isHost) {
            conn.send({
                type: 'sync-state',
                players: state.players,
                gameStarted: state.gameStarted,
                round: state.round,
                totalRounds: state.totalRounds,
                hostId: state.playerId,
                roomCode: state.roomCode,
                roundTime: state.roundTime,
                hintsPerRound: state.hintsPerRound,
                disconnectedPlayers: Array.from(state.disconnectedPlayers.entries())
            });
        }
    });

    conn.on('data', (data) => {
        handleMessage(data, conn);
    });

    conn.on('close', () => {
        handlePlayerDisconnect(conn.peer);
    });
}

function handlePlayerDisconnect(peerId) {
    console.log('Peer disconnected:', peerId);
    state.connections.delete(peerId);

    const playerIndex = state.players.findIndex(p => p.id === peerId);
    if (playerIndex !== -1) {
        const player = state.players[playerIndex];

        state.disconnectedPlayers.set(player.name.toLowerCase(), {
            score: player.score,
            color: player.color,
            timestamp: Date.now()
        });

        state.players.splice(playerIndex, 1);
        updatePlayersList();
        if (state.gameStarted) {
            updateGamePlayersList(state.players[state.currentDrawerIndex]?.name);
        }
        addChatMessage(`${player.name} disconnected (can rejoin)`, 'system');

        if (state.isHost) {
            broadcast({
                type: 'player-disconnected',
                players: state.players,
                disconnectedPlayer: player.name
            });
        }

        if (playerIndex < state.currentDrawerIndex) {
            state.currentDrawerIndex--;
        }

        if (state.gameStarted && state.currentDrawerIndex === playerIndex && state.isHost) {
            addChatMessage('Drawer left, skipping to next round...', 'system');
            setTimeout(() => {
                if (state.players.length >= 2) {
                    state.currentDrawerIndex--; // Will be incremented in startRound
                    startRound();
                } else {
                    addChatMessage('Not enough players to continue', 'system');
                    state.gameStarted = false;
                }
            }, 2000);
        }
    }

    if (peerId === state.hostId && !state.isHost) {
        handleHostDisconnect();
    }
}

function handleHostDisconnect() {
    stopTimer();
    state.hintTimers.forEach(timer => clearTimeout(timer));
    state.hintTimers = [];
    showToast('Host disconnected!', 'error');

    const shouldBecomeHost = confirm(
        'The host disconnected!\n\n' +
        'Would you like to become the new host?\n' +
        '(Click OK to create a new room with the same players)'
    );

    if (shouldBecomeHost) {
        becomeNewHost();
    } else {
        showScreen('lobby');
        resetState();
    }
}

async function becomeNewHost() {
    const savedPlayers = [...state.players];

    if (state.peer) {
        state.peer.destroy();
    }
    state.connections.clear();

    try {
        const roomCode = generateRoomCode();
        await initPeer(roomCode);

        state.roomCode = roomCode;
        state.isHost = true;
        state.hostId = state.playerId;

        state.players = [{
            id: state.playerId,
            name: state.playerName,
            color: state.playerColor,
            score: savedPlayers.find(p => p.name === state.playerName)?.score || 0,
            isHost: true
        }];

        savedPlayers.forEach(p => {
            if (p.name !== state.playerName) {
                state.disconnectedPlayers.set(p.name.toLowerCase(), {
                    score: p.score,
                    color: p.color,
                    timestamp: Date.now()
                });
            }
        });

        elements.displayRoomCode.textContent = roomCode;
        elements.startGameBtn.style.display = 'block';
        elements.gameSettings.style.display = 'block';

        showScreen('waiting-room');
        showToast(`You are now the host! New code: ${roomCode}`, 'success');
        addChatMessage(`Share new room code: ${roomCode}`, 'system');

        updatePlayersList();
    } catch (err) {
        console.error('Failed to become host:', err);
        showToast('Failed to create new room', 'error');
        showScreen('lobby');
    }
}

function resetState() {
    state.peer = null;
    state.connections.clear();
    state.roomCode = null;
    state.isHost = false;
    state.isDrawing = false;
    state.currentWord = null;
    state.players = [];
    state.round = 0;
    state.gameStarted = false;
    state.hostId = null;
    state.canvasHistory = [];
    stopTimer();
    state.hintTimers.forEach(timer => clearTimeout(timer));
    state.hintTimers = [];
    if (state.roundEndTimer) {
        clearTimeout(state.roundEndTimer);
        state.roundEndTimer = null;
    }
}

function broadcast(message, excludePeerId = null) {
    state.connections.forEach((conn, peerId) => {
        if (peerId !== excludePeerId && conn.open) {
            conn.send(message);
        }
    });
}

function sendToHost(message) {
    if (!state.isHost && state.hostId) {
        const hostConn = state.connections.get(state.hostId);
        if (hostConn && hostConn.open) {
            hostConn.send(message);
        }
    }
}

// ============================================
// MESSAGE HANDLERS
// ============================================
function handleMessage(message, conn) {
    switch (message.type) {
        case 'join-room':
            if (state.isHost) {
                if (state.players.length >= 8) {
                    conn.send({ type: 'error', message: 'Room is full' });
                    return;
                }

                const lowerName = message.name.toLowerCase();
                let previousScore = 0;
                let previousColor = message.color;
                let isReconnect = false;

                if (state.disconnectedPlayers.has(lowerName)) {
                    const oldData = state.disconnectedPlayers.get(lowerName);
                    if (Date.now() - oldData.timestamp < 10 * 60 * 1000) {
                        previousScore = oldData.score;
                        previousColor = oldData.color;
                        isReconnect = true;
                        state.disconnectedPlayers.delete(lowerName);
                    }
                }

                const newPlayer = {
                    id: conn.peer,
                    name: message.name,
                    color: previousColor,
                    score: previousScore,
                    isHost: false
                };
                state.players.push(newPlayer);

                broadcast({
                    type: 'player-joined',
                    player: newPlayer,
                    players: state.players,
                    isReconnect: isReconnect
                });

                conn.send({
                    type: 'sync-state',
                    players: state.players,
                    gameStarted: state.gameStarted,
                    round: state.round,
                    totalRounds: state.totalRounds,
                    hostId: state.playerId,
                    roomCode: state.roomCode,
                    roundTime: state.roundTime,
                    hintsPerRound: state.hintsPerRound,
                    isReconnect: isReconnect,
                    yourScore: previousScore,
                    currentDrawerIndex: state.currentDrawerIndex,
                    currentDrawer: state.gameStarted ? state.players[state.currentDrawerIndex]?.name : null,
                    currentWord: state.currentHint,
                    timeLeft: state.timeLeft
                });

                updatePlayersList();
                if (state.gameStarted) {
                    updateGamePlayersList(state.players[state.currentDrawerIndex]?.name);
                }

                if (isReconnect) {
                    if (window.playSound) playSound('join');
                    showToast(`${message.name} reconnected!`, 'success');
                    addChatMessage(`${message.name} reconnected!`, 'system');
                } else {
                    if (window.playSound) playSound('join');
                    showToast(`${message.name} joined!`, 'success');
                }
            }
            break;

        case 'sync-state':
            state.players = message.players;
            state.gameStarted = message.gameStarted;
            state.round = message.round;
            state.totalRounds = message.totalRounds;
            state.hostId = message.hostId;
            state.roomCode = message.roomCode;
            state.roundTime = message.roundTime || 80;
            state.hintsPerRound = message.hintsPerRound || 1;
            state.currentDrawerIndex = message.currentDrawerIndex;

            if (message.isReconnect) {
                showToast(`Reconnected with ${message.yourScore} points!`, 'success');
            }

            if (!state.players.find(p => p.id === state.playerId)) {
                state.players.push({
                    id: state.playerId,
                    name: state.playerName,
                    color: state.playerColor,
                    score: message.yourScore || 0,
                    isHost: false
                });
            }

            // Ensure we are in the list if not already
            if (!state.players.find(p => p.id === state.playerId)) {
                state.players.push({
                    id: state.playerId,
                    name: state.playerName,
                    color: state.playerColor,
                    score: message.yourScore || 0,
                    isHost: false
                });
            } else if (message.isReconnect) {
                // Update our own score if we already existed (e.g. rapid rejoin)
                const me = state.players.find(p => p.id === state.playerId);
                if (me) me.score = message.yourScore || me.score;
            }

            updatePlayersList();

            if (message.gameStarted) {
                state.currentHint = message.currentWord;
                // Don't restart timer here, wait for next round or sync time if needed
                showScreen('game');
                resizeCanvas();
                clearCanvas();
                elements.wordHint.textContent = state.currentHint || '???';
                if (message.currentDrawer) {
                    addChatMessage(`Current drawer: ${message.currentDrawer}`, 'system');
                    updateGamePlayersList(message.currentDrawer);
                }

                // If it's your turn, might need more sync logic here, but for now just showing screen
                addChatMessage('Rejoined the game!', 'system');
            } else {
                // Game hasn't started yet, ensure we're on waiting room
                showScreen('waiting-room');
                elements.displayRoomCode.textContent = message.roomCode || state.roomCode;
            }
            break;

        case 'player-joined':
            state.players = message.players;
            updatePlayersList();
            if (state.gameStarted) {
                updateGamePlayersList(state.players[state.currentDrawerIndex]?.name);
            }
            if (window.playSound) playSound('join');
            showToast(`${message.player.name} joined!`, 'success');
            break;

        case 'player-disconnected':
            state.players = message.players;
            updatePlayersList();
            if (state.gameStarted) {
                const drawer = message.players[state.currentDrawerIndex]?.name;
                updateGamePlayersList(drawer);
            }
            addChatMessage(`${message.disconnectedPlayer} disconnected`, 'system');
            break;

        case 'player-left':
            state.players = message.players;
            updatePlayersList();
            break;

        case 'error':
            showToast(message.message, 'error');
            break;

        case 'game-started':
            state.gameStarted = true;
            state.players = message.players;
            state.totalRounds = message.totalRounds;
            state.roundTime = message.roundTime;
            state.wordChoices = message.wordChoices || 3;
            state.hintsPerRound = message.hintsPerRound;
            showScreen('game');
            resizeCanvas();
            clearCanvas();
            addChatMessage('🎮 Game started! Get ready...', 'system');
            break;

        case 'your-turn':
            showWordSelection(message.words);
            break;

        case 'round-start':
            state.isDrawing = false;
            state.round = message.round;
            state.currentDrawerIndex = message.drawerIndex;
            state.hintsUsed = 0;
            elements.drawingTools.style.display = 'none';
            elements.hintBtn.style.display = state.hintsPerRound > 0 ? 'inline-block' : 'none';
            elements.hintBtn.disabled = false;
            elements.wordHint.textContent = '???';
            addChatMessage(`🎨 ${message.drawer} is drawing!`, 'system');
            elements.roundDisplay.textContent = `${message.round}/${message.totalRounds}`;
            updateGamePlayersList(message.drawer);
            break;

        case 'word-hint':
            state.currentHint = message.hint;
            elements.wordHint.textContent = message.hint;
            startTimer(state.roundTime);
            break;

        case 'drawing-start':
            state.isDrawing = true;
            state.currentWord = message.word;
            state.canvasHistory = [];
            elements.drawingTools.style.display = 'flex';
            elements.hintBtn.style.display = 'none';
            elements.wordHint.textContent = message.word.toUpperCase();
            clearCanvas();
            hideWordSelection();
            startTimer(state.roundTime);
            addChatMessage(`Draw: ${message.word}`, 'system');
            break;

        case 'draw':
            const d = message.data;
            drawLine(d.x1, d.y1, d.x2, d.y2, d.color, d.size);
            if (state.isHost) {
                broadcast(message, conn.peer);
            }
            break;

        case 'fill':
            floodFill(message.x, message.y, message.color);
            if (state.isHost) {
                broadcast(message, conn.peer);
            }
            break;

        case 'canvas-state':
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = message.imageData;
            if (state.isHost) {
                broadcast(message, conn.peer);
            }
            break;

        case 'clear-canvas':
            clearCanvas();
            if (state.isHost) {
                broadcast(message, conn.peer);
            }
            break;

        case 'chat':
            if (state.isHost) {
                processGuess(message.text, message.playerName, message.playerId);
            } else {
                addChatMessage(message.text, 'normal', message.playerName);
            }
            break;

        case 'chat-broadcast':
            addChatMessage(message.text, message.msgType || 'normal', message.playerName);
            break;

        case 'correct-guess':
            if (window.playSound) playSound('correct');
            addChatMessage(`🎉 ${message.playerName} guessed the word! (+${message.points})`, 'correct');
            state.players = message.players;
            updateScores();
            break;

        case 'close-guess':
            if (window.playSound) playSound('wrong');
            showToast("That's close! 🔥", 'warning');
            break;

        case 'word-selected':
            if (state.isHost) {
                handleWordSelected(message.word, message.difficulty, conn.peer);
            }
            break;

        case 'hint-reveal':
            state.currentHint = message.hint;
            elements.wordHint.textContent = message.hint;
            if (window.playSound) playSound('hint');
            addChatMessage('💡 A letter was revealed!', 'system');
            break;

        case 'round-end':
            stopTimer();
            state.isDrawing = false;
            state.players = message.players;
            elements.drawingTools.style.display = 'none';
            if (window.playSound) playSound('roundEnd');
            showRoundEnd(message.word, message.players);
            break;

        case 'game-end':
            stopTimer();
            if (window.playSound) playSound('win');
            showGameEnd(message.rankings);
            break;

        case 'reaction':
            showFloatingReaction(message.reaction);
            if (state.isHost) {
                broadcast(message, conn.peer);
            }
            break;
    }
}

// ============================================
// GAME LOGIC (HOST ONLY)
// ============================================
function getRandomWords(count = null) {
    const numWords = count || state.wordChoices || 3;
    const words = [];
    const usedIndices = new Set();

    // Pick random words from the combined list
    while (words.length < numWords && usedIndices.size < WORDS.length) {
        const index = Math.floor(Math.random() * WORDS.length);
        if (!usedIndices.has(index)) {
            usedIndices.add(index);
            words.push({ word: WORDS[index] });
        }
    }

    return words;
}

function createHint(word, revealCount = 0) {
    const chars = word.split('');
    const hint = chars.map((char, i) => {
        if (char === ' ') return '  ';
        if (revealCount > 0) {
            // Reveal some letters
            const revealIndices = [];
            for (let j = 0; j < word.length; j++) {
                if (word[j] !== ' ') revealIndices.push(j);
            }
            // Shuffle and take first N
            for (let j = revealIndices.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [revealIndices[j], revealIndices[k]] = [revealIndices[k], revealIndices[j]];
            }
            const toReveal = revealIndices.slice(0, revealCount);
            if (toReveal.includes(i)) return char.toUpperCase();
        }
        return '_';
    });
    return hint.join(' ');
}

function revealHint() {
    if (!state.isHost || !state.currentWord || state.hintsUsed >= state.hintsPerRound) return;

    state.hintsUsed++;
    const hint = createHint(state.currentWord, state.hintsUsed);
    state.currentHint = hint;

    broadcast({ type: 'hint-reveal', hint: hint });
    elements.wordHint.textContent = hint;

    if (state.hintsUsed >= state.hintsPerRound) {
        elements.hintBtn.disabled = true;
    }

    if (window.playSound) playSound('hint');
    addChatMessage('💡 A letter was revealed!', 'system');
}

function startRound() {
    if (!state.isHost) return;
    if (state.players.length < 2) {
        addChatMessage('Waiting for more players...', 'system');
        return;
    }

    state.currentDrawerIndex = (state.currentDrawerIndex + 1) % state.players.length;
    state.round++;
    state.guessedPlayers = new Set();
    state.currentWord = null;
    state.currentHint = '';
    state.hintsUsed = 0;
    state.roundStartTime = null;
    state.canvasHistory = [];

    const drawer = state.players[state.currentDrawerIndex];
    const wordOptions = getRandomWords();

    broadcast({
        type: 'round-start',
        drawer: drawer.name,
        drawerIndex: state.currentDrawerIndex,
        round: state.round,
        totalRounds: state.totalRounds
    });

    elements.roundDisplay.textContent = `${state.round}/${state.totalRounds}`;
    addChatMessage(`🎨 ${drawer.name} is drawing!`, 'system');
    updateGamePlayersList(drawer.name);

    if (drawer.id === state.playerId) {
        showWordSelection(wordOptions);
    } else {
        const drawerConn = state.connections.get(drawer.id);
        if (drawerConn) {
            drawerConn.send({ type: 'your-turn', words: wordOptions });
        }
    }

    // Set 20-second timeout for word selection
    if (state.wordSelectionTimer) {
        clearTimeout(state.wordSelectionTimer);
    }
    state.wordSelectionTimer = setTimeout(() => {
        if (state.gameStarted && !state.currentWord) {
            addChatMessage(`${drawer.name} took too long to choose! Skipping...`, 'system');
            broadcast({
                type: 'chat-broadcast',
                text: `${drawer.name} took too long to choose! Skipping...`,
                msgType: 'system'
            });
            // Skip to next round
            if (state.round >= state.totalRounds) {
                endGame();
            } else {
                startRound();
            }
        }
    }, 20000);

    state.isDrawing = false;
    elements.drawingTools.style.display = 'none';
    elements.wordHint.textContent = '???';
}

function handleWordSelected(word, difficulty, drawerId) {
    // Clear word selection timer
    if (state.wordSelectionTimer) {
        clearTimeout(state.wordSelectionTimer);
        state.wordSelectionTimer = null;
    }

    state.currentWord = word.toLowerCase();
    state.currentWordDifficulty = difficulty;
    state.roundStartTime = Date.now();

    const hint = createHint(state.currentWord);
    state.currentHint = hint;

    broadcast({
        type: 'word-hint',
        hint: hint,
        length: state.currentWord.length
    });

    if (drawerId === state.playerId) {
        state.isDrawing = true;
        state.canvasHistory = [];
        elements.drawingTools.style.display = 'flex';
        elements.hintBtn.style.display = 'none';
        elements.wordHint.textContent = state.currentWord.toUpperCase();
        clearCanvas();
        hideWordSelection();
        startTimer(state.roundTime);
        addChatMessage(`Draw: ${state.currentWord}`, 'system');
    } else {
        const drawerConn = state.connections.get(drawerId);
        if (drawerConn) {
            drawerConn.send({
                type: 'drawing-start',
                word: state.currentWord
            });
        }
    }

    // Clear any previous hint timers
    state.hintTimers.forEach(timer => clearTimeout(timer));
    state.hintTimers = [];

    // Clear any previous round-end timer
    if (state.roundEndTimer) {
        clearTimeout(state.roundEndTimer);
        state.roundEndTimer = null;
    }

    // Schedule automatic hint at 60% elapsed time (40% remaining)
    if (state.hintsPerRound > 0) {
        const hintTime = state.roundTime * 0.6 * 1000; // 60% of round time
        const timer = setTimeout(() => {
            if (state.gameStarted && state.currentWord && state.roundStartTime) {
                revealHint();
            }
        }, hintTime);
        state.hintTimers.push(timer);
    }

    elements.wordHint.textContent = hint;
    // Only start timer once (not twice)
    if (drawerId !== state.playerId) {
        // Non-drawing host starts timer here
        startTimer(state.roundTime);
    }

    // Track the round-end timeout so we can cancel it if needed
    state.roundEndTimer = setTimeout(() => {
        if (state.gameStarted && state.currentWord) {
            endRound('time');
        }
    }, state.roundTime * 1000);
}

function processGuess(text, playerName, playerId) {
    if (!state.isHost || !state.currentWord) return;

    const guess = text.toLowerCase().trim();
    const drawer = state.players[state.currentDrawerIndex];

    if (!drawer || playerId === drawer.id) return;
    if (state.guessedPlayers.has(playerId)) return;

    if (guess === state.currentWord) {
        state.guessedPlayers.add(playerId);

        const elapsed = (Date.now() - state.roundStartTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((state.roundTime - elapsed) / state.roundTime * 200));

        // Same points for all words (no difficulty bonus)
        const points = 100 + timeBonus;

        const player = state.players.find(p => p.id === playerId);
        if (player) player.score += points;
        if (drawer) drawer.score += 25;

        broadcast({
            type: 'correct-guess',
            playerName: playerName,
            points: points,
            players: state.players
        });

        if (window.playSound) playSound('correct');
        addChatMessage(`🎉 ${playerName} guessed the word! (+${points})`, 'correct');
        updateScores();

        if (state.guessedPlayers.size >= state.players.length - 1) {
            setTimeout(() => endRound('all-guessed'), 500);
        }
    } else {
        broadcast({
            type: 'chat-broadcast',
            playerName: playerName,
            text: text,
            msgType: 'normal'
        });
        addChatMessage(text, 'normal', playerName);

        if (state.currentWord.includes(guess) || guess.includes(state.currentWord)) {
            const guesserConn = state.connections.get(playerId);
            if (guesserConn) {
                guesserConn.send({ type: 'close-guess' });
            }
        }
    }
}

function endRound(reason) {
    if (!state.isHost) return;

    broadcast({
        type: 'round-end',
        word: state.currentWord,
        reason: reason,
        players: state.players
    });

    if (window.playSound) playSound('roundEnd');
    showRoundEnd(state.currentWord, state.players);

    // Clear round-end timer to prevent double-firing
    if (state.roundEndTimer) {
        clearTimeout(state.roundEndTimer);
        state.roundEndTimer = null;
    }
    // Clear hint timers
    state.hintTimers.forEach(timer => clearTimeout(timer));
    state.hintTimers = [];

    state.currentWord = null;
    state.isDrawing = false;
    elements.drawingTools.style.display = 'none';

    if (state.round >= state.totalRounds) {
        setTimeout(() => endGame(), 3500);
    } else {
        setTimeout(() => startRound(), 3500);
    }
}

function endGame() {
    if (!state.isHost) return;

    const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
    const rankings = sortedPlayers.map((p, i) => ({
        rank: i + 1,
        name: p.name,
        score: p.score,
        color: p.color
    }));

    broadcast({ type: 'game-end', rankings: rankings });
    if (window.playSound) playSound('win');
    showGameEnd(rankings);

    state.gameStarted = false;
    state.round = 0;
    state.currentDrawerIndex = -1;
    state.players.forEach(p => p.score = 0);
}

// ============================================
// UI FUNCTIONS
// ============================================
function showScreen(screen) {
    elements.lobbyScreen.classList.remove('active');
    elements.waitingRoomScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');

    switch (screen) {
        case 'lobby':
            elements.lobbyScreen.classList.add('active');
            break;
        case 'waiting-room':
            elements.waitingRoomScreen.classList.add('active');
            break;
        case 'game':
            elements.gameScreen.classList.add('active');
            break;
    }
}

function updatePlayersList() {
    elements.playerCount.textContent = `(${state.players.length}/8)`;
    elements.playersList.innerHTML = state.players.map((player) => `
        <li>
            <div class="avatar" style="background: ${player.color}">${player.name.charAt(0).toUpperCase()}</div>
            <span class="name">${player.name}</span>
            ${player.isHost ? '<span class="host-badge">HOST</span>' : ''}
        </li>
    `).join('');

    if (state.isHost) {
        elements.startGameBtn.style.display = 'block';
        elements.gameSettings.style.display = 'block';
    }
}

function updateGamePlayersList(drawer) {
    const sortedPlayers = [...state.players].sort((a, b) => (b.score || 0) - (a.score || 0));

    elements.gamePlayersList.innerHTML = sortedPlayers.map((player, index) => `
        <li class="${player.name === drawer ? 'drawing' : ''}">
            <span class="rank" style="background: ${player.color}">${index + 1}</span>
            <span class="name">${player.name}</span>
            <span class="score">${player.score || 0}</span>
            ${player.name === drawer ? '<span class="status-icon">🎨</span>' : ''}
        </li>
    `).join('');
}

function updateScores() {
    const sortedPlayers = [...state.players].sort((a, b) => (b.score || 0) - (a.score || 0));
    elements.gamePlayersList.innerHTML = sortedPlayers.map((player, index) => `
        <li>
            <span class="rank" style="background: ${player.color}">${index + 1}</span>
            <span class="name">${player.name}</span>
            <span class="score">${player.score || 0}</span>
        </li>
    `).join('');
}

function addChatMessage(text, type = 'normal', sender = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;

    if (sender) {
        messageDiv.innerHTML = `<span class="sender">${sender}:</span>${escapeHtml(text)}`;
    } else {
        messageDiv.textContent = text;
    }

    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showWordSelection(words) {
    elements.wordOptions.innerHTML = words.map(w => `
        <button onclick="selectWord('${w.word}')">
            ${w.word}
        </button>
    `).join('');
    elements.wordModal.classList.add('active');
}

function hideWordSelection() {
    elements.wordModal.classList.remove('active');
}

function selectWord(word) {
    if (state.isHost) {
        handleWordSelected(word, 'normal', state.playerId);
    } else {
        sendToHost({ type: 'word-selected', word: word, difficulty: 'normal' });
    }
    hideWordSelection();
}

function showRoundEnd(word, players) {
    stopTimer();
    elements.overlayWord.innerHTML = `The word was: <strong>${word}</strong>`;
    elements.overlayScores.innerHTML = players
        .sort((a, b) => b.score - a.score)
        .map(p => `
            <div class="score-item">
                <span style="color: ${p.color}">●</span>
                <span>${p.name}</span>
                <span class="points">${p.score}</span>
            </div>
        `).join('');
    elements.roundOverlay.classList.add('active');

    setTimeout(() => {
        elements.roundOverlay.classList.remove('active');
        clearCanvas();
    }, 3000);
}

function showGameEnd(rankings) {
    const medals = ['🥇', '🥈', '🥉'];
    elements.finalRankings.innerHTML = rankings.map((r, i) => `
        <div class="rank-item" style="border-left: 4px solid ${r.color}">
            <span class="medal">${medals[i] || `#${r.rank}`}</span>
            <span class="player-name">${r.name}</span>
            <span class="player-score">${r.score} pts</span>
        </div>
    `).join('');
    elements.gameEndModal.classList.add('active');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// TIMER
// ============================================
function startTimer(seconds) {
    stopTimer();
    state.timeLeft = seconds;
    const circumference = 2 * Math.PI * 45;

    elements.timerText.textContent = state.timeLeft;
    elements.timerProgress.style.strokeDashoffset = '0';

    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        elements.timerText.textContent = state.timeLeft;

        const progress = (1 - state.timeLeft / seconds) * circumference;
        elements.timerProgress.style.strokeDashoffset = progress;

        if (state.timeLeft <= 10) {
            elements.timerProgress.style.stroke = '#e74c3c';
            if (window.playSound) playSound('tick');
        } else if (state.timeLeft <= 20) {
            elements.timerProgress.style.stroke = '#fdcb6e';
        } else {
            elements.timerProgress.style.stroke = '#6c5ce7';
        }

        if (state.timeLeft <= 0) {
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Create Room
elements.createRoomBtn.addEventListener('click', async () => {
    const name = elements.playerNameInput.value.trim();
    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }

    // Get custom room code or generate random
    let roomCode = elements.customRoomCodeInput.value.trim().toUpperCase();
    if (roomCode) {
        // Validate custom code
        if (roomCode.length < 4 || roomCode.length > 6) {
            showToast('Room code must be 4-6 characters', 'error');
            return;
        }
        // Only allow alphanumeric
        if (!/^[A-Z0-9]+$/.test(roomCode)) {
            showToast('Room code can only contain letters and numbers', 'error');
            return;
        }
    } else {
        roomCode = generateRoomCode();
    }

    elements.createRoomBtn.disabled = true;
    elements.createRoomBtn.innerHTML = '<span class="btn-icon">⏳</span> Creating...';

    try {
        await initPeer(roomCode);

        state.roomCode = roomCode;
        state.playerName = name;
        state.isHost = true;
        state.hostId = state.playerId;
        state.players = [{
            id: state.playerId,
            name: name,
            color: state.playerColor,
            score: 0,
            isHost: true
        }];

        elements.displayRoomCode.textContent = roomCode;
        elements.startGameBtn.style.display = 'block';
        elements.gameSettings.style.display = 'block';
        updatePlayersList();
        showScreen('waiting-room');
        showToast('Room created!', 'success');
    } catch (err) {
        console.error('Failed to create room:', err);
        if (err.type === 'unavailable-id') {
            showToast('This room code is already taken. Try another!', 'error');
        }
    }

    elements.createRoomBtn.disabled = false;
    elements.createRoomBtn.innerHTML = '<span class="btn-icon">✨</span> Create Room';
});

// Public Room Buttons
document.querySelectorAll('.room-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        elements.roomCodeInput.value = code;

        // Add visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 100);

        // Optional: Highlight the join button
        elements.joinRoomBtn.classList.add('btn-primary');
        elements.joinRoomBtn.classList.remove('btn-secondary');
        setTimeout(() => {
            elements.joinRoomBtn.classList.add('btn-secondary');
            elements.joinRoomBtn.classList.remove('btn-primary');
        }, 1000);
    });
});

// Join Room
elements.joinRoomBtn.addEventListener('click', async () => {
    const name = elements.playerNameInput.value.trim();
    const code = elements.roomCodeInput.value.trim().toUpperCase();

    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }
    if (!code || code.length < 4 || code.length > 6) {
        showToast('Please enter a valid room code (4-6 characters)', 'error');
        return;
    }

    elements.joinRoomBtn.disabled = true;
    elements.joinRoomBtn.innerHTML = '<span class="btn-icon">⏳</span> Joining...';

    try {
        await initPeer();
        const conn = await connectToHost(code);

        state.roomCode = code;
        state.playerName = name;
        state.isHost = false;

        conn.send({ type: 'join-room', name: name, color: state.playerColor });

        // Save session
        localStorage.setItem('skribbl_session', JSON.stringify({
            name: state.playerName,
            roomCode: state.roomCode,
            id: state.playerId,
            color: state.playerColor
        }));

        elements.displayRoomCode.textContent = code;
        elements.startGameBtn.style.display = 'none';
        elements.gameSettings.style.display = 'none';
        showScreen('waiting-room');
        showToast('Joined room!', 'success');
    } catch (err) {
        console.error('Failed to join room:', err);
        showToast('Failed to join room', 'error');
    }

    elements.joinRoomBtn.disabled = false;
    elements.joinRoomBtn.innerHTML = '<span class="btn-icon">🚀</span> Join Room';
});

// Copy room code
elements.copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(state.roomCode)
        .then(() => showToast('Room code copied!', 'success'))
        .catch(() => showToast('Failed to copy', 'error'));
});

// Start Game
elements.startGameBtn.addEventListener('click', () => {
    if (!state.isHost) return;

    if (state.players.length < 2) {
        showToast('Need at least 2 players to start', 'error');
        return;
    }

    // Get settings
    state.roundsPerPlayer = parseInt(elements.roundsSelect.value);
    state.roundTime = parseInt(elements.timeSelect.value);
    state.wordChoices = parseInt(elements.wordChoicesSelect?.value || 3);
    state.hintsPerRound = parseInt(elements.hintsSelect.value);

    state.gameStarted = true;
    state.round = 0;
    state.currentDrawerIndex = -1;
    state.totalRounds = state.players.length * state.roundsPerPlayer;
    state.players.forEach(p => p.score = 0);

    broadcast({
        type: 'game-started',
        players: state.players,
        totalRounds: state.totalRounds,
        roundTime: state.roundTime,
        wordChoices: state.wordChoices,
        hintsPerRound: state.hintsPerRound
    });

    showScreen('game');
    resizeCanvas();
    clearCanvas();


    setTimeout(() => startRound(), 1500);
});

// Leave Room
elements.leaveRoomBtn.addEventListener('click', () => {
    if (state.peer) {
        state.peer.destroy();
    }
    resetState();
    showScreen('lobby');
});

// Chat
function sendChat() {
    const text = elements.chatInput.value.trim();
    if (!text) return;

    if (state.isHost) {
        processGuess(text, state.playerName, state.playerId);
    } else {
        sendToHost({
            type: 'chat',
            text: text,
            playerName: state.playerName,
            playerId: state.playerId
        });
    }

    elements.chatInput.value = '';
}

elements.sendChatBtn.addEventListener('click', sendChat);
elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChat();
});

// Room code input
elements.roomCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') elements.joinRoomBtn.click();
});

// Hint button
elements.hintBtn.addEventListener('click', () => {
    if (state.isHost) {
        revealHint();
    } else {
        // Players can request hints (host decides)
        sendToHost({ type: 'request-hint' });
    }
});

// Play Again
elements.playAgainBtn.addEventListener('click', () => {
    elements.gameEndModal.classList.remove('active');
    showScreen('waiting-room');
    elements.chatMessages.innerHTML = '';
});

// Warn before leaving
window.addEventListener('beforeunload', (e) => {
    if (state.isHost && state.players.length > 1) {
        e.preventDefault();
        e.returnValue = 'You are the host! Leaving will disconnect all players.';
        return e.returnValue;
    }
});

// Initialize
clearCanvas();
window.selectWord = selectWord;

// Check for existing session on page load
window.addEventListener('load', () => {
    const session = localStorage.getItem('skribbl_session');
    if (session) {
        try {
            const { name, roomCode, id, color } = JSON.parse(session);
            if (name && roomCode) {
                // Pre-fill inputs
                const nameInput = document.getElementById('player-name');
                const codeInput = document.getElementById('room-code-input');
                const joinBtn = document.getElementById('join-room-btn');

                if (nameInput) nameInput.value = name;
                if (codeInput) codeInput.value = roomCode;

                // Restore state
                state.playerId = id;
                state.playerColor = color || '#6c5ce7'; // Default if missing

                // Auto-join removed as per request
                showToast('Previous session found! Click Join to continue.', 'info');
            }
        } catch (e) {
            console.error('Failed to restore session:', e);
            localStorage.removeItem('skribbl_session');
        }
    }
});

console.log('🎨 Varaipadam loaded! வரைபடம்');
