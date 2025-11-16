# DLC Editor for p5.js & Processing

A web-based tool built with plain HTML, CSS, and JavaScript (plus the p5.js library) to help create and manage DLC for p5.js and Processing games.

This editor is a single application that provides two tools in one.

## 🚀 Live Demo

**Try the editor live at: [dlc-editor.netlify.app](https://dlc-editor.netlify.app)**

---

## Features

### 📄 Unit Editor (.json)
This tool creates `config.json` files for adding new units/characters to your game.

* **Load Project:** Load an existing `config.json` file to edit.
* **Create Units:** Set character stats (`Health`, `ATK`, `DEF`), `Name`, and `Description`.
* **Link Animations:** Define the `.txt` animation files your new unit will use.
* **Manage List:** Add multiple units, delete specific ones, or clear the entire list.
* **Download:** Save your work as a `config.json` file, ready to be added to your game.

### 🖼️ Sprite Editor (.txt)
This tool generates the `.txt` config strings needed for individual animations.

* **Define Paths:** Set the `Character Folder Name`, `Animation Name`, and `Image File Prefix`.
* **Configure:** Set the `Frame Count` and file extension.
* **Position:** Adjust the `X`, `Y`, and `Scale` of the sprite.
* **Live Preview:** An optional, built-in **p5.js canvas** to preview your animations in real-time.

---

## ⚙️ How to Use (Locally)

1.  Download or clone this repository.
2.  Open the `index.html` file in your browser.
3.  Use the tabs to switch between the **Unit Editor** and **Sprite Editor**.

**Note:** For the Live Preview feature, you **must** run this from a local server (like the "Live Server" extension in VS Code). Opening the `index.html` file directly from your computer will not work.

### How to Use the Live Preview

The live preview is **optional** and requires a one-time setup:

1.  Copy the `data` folder (containing all your game's sprites) from your main game project.
2.  Paste this `data` folder into the root of this editor's project folder (so it's next to `index.html`).
3.  Go to the **Sprite Editor (.txt)** tab and fill in the animation details.
4.  Check the **"Enable Live Preview"** box.
5.  Your animation will appear in the preview box.

#### 💡 Test with the `Warrior`
* **Character Folder Name:** `Warrior`
* **Animation Name:** `Idle`
* **Image File Prefix:** `Warrior_Idle_`
* **Frame Count:** `6`
