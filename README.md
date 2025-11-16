# DLC Editor for p5.js & Processing

A web-based tool built with plain HTML, CSS, and JavaScript to help create and manage DLC (downloadable content) for p5.js and Processing games.

This editor provides three integrated tools for managing game assets and configurations.

## 🚀 Live Demo

**Try the editor live at: [dlc-editor.netlify.app](https://dlc-editor.netlify.app)**

---

## Features

### 📄 Unit Editor (.json)
Create `config.json` files to add new units/characters to your game.

* **Load Project:** Import an existing `config.json` file to edit.
* **Create Units:** Define character stats (`Health`, `ATK`, `DEF`), `Name`, and `Description`.
* **Link Animations:** Assign the `.txt` animation files your unit will use (Idle, Attack, Walk, Death).
* **Manage Units:** Add multiple units, edit existing ones, or delete them individually.
* **Download:** Save your work as a `config.json` file ready for your game.

### 🖼️ Sprite Editor (.txt)
Generate the `.txt` config strings needed for individual animations.

* **Define Paths:** Set the `Character Folder Name`, `Animation Name`, and `Image File Prefix`.
* **Configure:** Specify the `Frame Count` and file extension.
* **Position & Scale:** Adjust the `X`, `Y` coordinates and `Scale` of the sprite on screen.
* **Live Preview:** Optional built-in p5.js canvas to preview your animations in real-time.
* **Download:** Export the config string as a `.txt` file.

### ✂️ Sprite Cutter (.zip)
Cut spritesheets into individual frames and organize them into a folder structure.

* **Batch Processing:** Load multiple spritesheets at once (e.g., `Warrior_Idle_Sheet.png`, `Warrior_Attack_Sheet.png`).
* **Automatic Organization:** Files are automatically parsed and organized into `Character/Animation/` folder structure.
* **Flexible Grid Calculation:** Choose between two modes:
  - **Define by Count (recommended):** Enter rows and columns; pixel dimensions auto-calculate.
  - **Define by Pixel Size:** Enter sprite width/height; rows/columns auto-calculate.
* **Batch Download:** Generate a single `.zip` file containing all processed sprites.

---

## ⚙️ How to Use (Locally)

1. Download or clone this repository.
2. Open `index.html` in your browser.
3. Use the tabs to switch between the three editors.

**Note:** For the Live Preview feature, you must run this from a local server (like the "Live Server" extension in VS Code). Opening `index.html` directly will not work.

### Live Preview Setup

The live preview is **optional** and requires one-time setup:

1. Copy your game project's `data` folder (containing all sprites).
2. Paste it into the editor's root folder (next to `index.html`).
3. Go to the **Sprite Editor** tab and fill in animation details.
4. Check **"Enable Live Preview"**.
5. Your animation appears in the preview box.

#### Test with the `Warrior` Example
* **Character Folder Name:** `Warrior`
* **Animation Name:** `Idle`
* **Image File Prefix:** `Warrior_Idle_`
* **Frame Count:** `6`

### Sprite Cutter Naming Convention

Files must follow this naming format: `Character_Animation_Sheet.ext`

Examples:
* `Warrior_Idle_Sheet.png`
* `Warrior_Attack_Sheet.png`
* `Knight_Walk_Sheet.jpg`

The tool automatically extracts the character name and animation type from the filename and organizes them accordingly.
