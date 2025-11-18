# DLC Editor for p5.js & Processing

A web-based tool built with plain HTML, CSS, and JavaScript to help create and manage DLC (downloadable content) for p5.js and Processing games.

This tool allows users to define unit stats, align animations with a live preview, slice raw spritesheets, and compile all assets into a game-ready `.zip` package without needing complex external software.

## 🚀 Live Demo

**Try the editor live at: [dlc-editor.netlify.app](https://dlc-editor.netlify.app) or [ppanturat.github.io/dlc-editor/](https://ppanturat.github.io/dlc-editor/)**

---

## ✨ Key Features

The editor is split into four distinct modules:

### 1. 📊 Unit Editor (JSON)
* Define core character stats (Health, Attack, Defense).
* Assign animation configuration filenames.
* **Output:** Generates the master `config.json`.

### 2. 🎬 Sprite Editor (TXT)
* Configure animation offsets and coordinate mapping.
* **Live Preview:** Uses **p5.js** to render animations in real-time before exporting.
* **Output:** Generates individual `.txt` configuration files for actions (Idle, Walk, Attack, etc.).

### 3. ✂️ Sprite Cutter (ZIP)
* Upload raw spritesheets (Grid format).
* Auto-slices images based on row/column count or pixel size.
* Automatically organizes frames into the required folder structure (e.g., `Warrior/Idle/1.png`).
* **Output:** Downloads a structured `sprites.zip`.

### 4. 📦 DLC Compiler
* The final assembly line.
* Merges the Unit JSON, Animation Configs, and Image ZIP.
* **Output:** A single, install-ready `DLC_CharacterName.zip`.

---

## 📚 Getting Started

This is a **static web application**. You do not need NodeJS, Python, or a backend server to run it.

### Option 1: Run Locally
1.  Clone or download this repository.
2.  Open `index.html` in your web browser.
    * *Note:* For the **Live Preview** feature to work correctly with local images, you may need to run a local server (due to browser security policies regarding local file access).
    * If using VS Code, install the **Live Server** extension and click "Go Live".

### Option 2: Use Live Demo
Simply use the live demo provided above.
* *Note:* You will not be able to use sprite animation preview feature (except the given Warrior_Idle_)

---

## 📂 Folder Structure

```text
/
├── index.html        # Main entry point
├── style.css         # Styling
├── Editor.js         # Unit Editor logic
├── Preview.js        # p5.js Animation Preview logic
├── Cutter.js         # Sprite Slicing logic
├── Compiler.js       # Final ZIP compilation logic
└── libraries/        # Dependencies
    ├── p5.min.js
    └── jszip.min.js
└── data/             # Required for Live Preview
    └── Warrior/      # For testing (given)
        └── Idle/
            ├── Warrior_Idle_1.png
            ├── Warrior_Idle_2.png
            ├── Warrior_Idle_3.png
            ├── Warrior_Idle_4.png
            ├── Warrior_Idle_5.png
            ├── Warrior_Idle_6.png
