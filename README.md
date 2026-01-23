# 🎨 வரைபடம் (Varaipadam)

<div align="center">

![Varaipadam Logo](https://img.shields.io/badge/வரை-படம்-6c5ce7?style=for-the-badge&logoColor=white&labelColor=1a1a2e)

**A fun multiplayer drawing and guessing game built with pure JavaScript!**

[![Made with JavaScript](https://img.shields.io/badge/Made_with-JavaScript-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PeerJS](https://img.shields.io/badge/P2P-PeerJS-00b894?style=flat-square)](https://peerjs.com/)
[![License](https://img.shields.io/badge/License-MIT-a29bfe?style=flat-square)](LICENSE)

[🎮 Play Now](#getting-started) • [✨ Features](#features) • [🛠️ Tech Stack](#tech-stack) • [📸 Screenshots](#screenshots)

</div>

---

## 🌟 What is Varaipadam?

**Varaipadam** (வரைபடம் - Tamil for "Drawing") is a real-time multiplayer drawing and guessing game inspired by Skribbl.io. Create a room, invite your friends, and take turns drawing while others guess the word!

> 🧑‍🦽 Have fun maamae! 🔥

---

## ✨ Features

### 🎮 **Gameplay**
- 🖌️ **Draw & Guess** - Take turns drawing while others guess the word
- 🏆 **Score System** - Faster guesses = More points!
- 🎯 **Word Difficulty** - Choose from easy, medium, or hard words
- 💡 **Hints** - Auto-revealing letters as time runs out
- ⏱️ **Timer** - Configurable round duration (45s - 150s)

### 🎨 **Drawing Tools**
- 🖌️ Brush with multiple sizes
- 🪣 Fill bucket for quick coloring
- 🧹 Eraser
- ↩️ Undo functionality
- 🗑️ Clear canvas
- 🎨 Rich color palette

### 🌐 **Multiplayer**
- 🔗 **P2P Connection** - No server needed! Direct peer-to-peer
- 👥 **Up to 20 Players** - Host configurable
- 🔑 **Custom Room Codes** - Create memorable room codes
- 🗳️ **Kick Voting** - Vote to remove disruptive players
- 🔄 **Reconnection** - Rejoin if disconnected

### 💬 **Social**
- 💭 **Real-time Chat** - Guess and chat with friends
- 😂 **Quick Reactions** - 👍 👎 😂 🔥 👏
- 🎉 **Floating Emojis** - Express yourself!

### 🎯 **Customizable**
- ⚙️ **Game Settings** - Rounds, time, hints, max players
- 🎨 **Avatar Colors** - Pick your color
- 📱 **Responsive** - Works on mobile and desktop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Structure |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Styling (Glassmorphism UI) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Game Logic |
| ![PeerJS](https://img.shields.io/badge/PeerJS-00B894?style=flat-square) | P2P WebRTC Connections |
| ![Canvas](https://img.shields.io/badge/Canvas_API-FF6B6B?style=flat-square) | Drawing |

---

## 🚀 Getting Started

### Option 1: Play Online
Simply open `index.html` in your browser and start playing!

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/varaipadam.git

# Navigate to project directory
cd varaipadam

# Open in browser (or use any local server)
# Option A: Direct file
open index.html

# Option B: Using Python
python -m http.server 8080

# Option C: Using Node.js
npx serve
```

---

## 🎮 How to Play

1. **Enter your name** and choose an avatar color
2. **Create a room** or **join** with a room code
3. **Share the room code** with friends
4. **Start the game** when everyone's ready
5. **Take turns drawing** - Choose a word and draw it!
6. **Guess others' drawings** - Type your guesses in chat
7. **Score points** - Faster guesses earn more points!

---

## 📂 Project Structure

```
varaipadam/
├── index.html      # Main HTML structure
├── styles.css      # All styling (glassmorphism theme)
├── game.js         # Game logic & P2P networking
├── sounds.js       # Sound effects (Web Audio API)
└── README.md       # You are here!
```

---

## 🎨 UI Features

- **🌙 Dark Theme** - Easy on the eyes
- **✨ Glassmorphism** - Modern frosted glass effect
- **🎭 Smooth Animations** - Floating shapes, transitions
- **📱 Mobile Friendly** - Responsive design

---

## 🔧 Game Settings

| Setting | Options | Default |
|---------|---------|---------|
| Rounds per Player | 1-5 | 2 |
| Draw Time | 45-150 seconds | 80s |
| Max Players | 2-20 | 20 |
| Hints | 0-3 | 1 |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🔃 Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by [Skribbl.io](https://skribbl.io)
- Built with [PeerJS](https://peerjs.com) for P2P connections
- Fonts from [Google Fonts (Outfit)](https://fonts.google.com/specimen/Outfit)

---

<div align="center">

**Made with ❤️ and ☕**

⭐ Star this repo if you enjoyed playing! ⭐

</div>
