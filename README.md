# DLC Editor 
for p5.js and Processing

A web-based tool built with HTML, CSS, and JavaScript to help create and manage DLC (Downloadable Content) for p5.js and Processing games.

This editor is a single application that provides two tools in one.

---

## Features

### 1. Unit Editor (.json)
This tool creates `config.json` files for adding new units/characters to your game.

* **Load Project:** Load an existing `config.json` file to edit.
* **Create Units:** Set character stats (Health, ATK, DEF), name, and description.
* **Link Animations:** Define the `.txt` animation files your new unit will use.
* **Manage List:** Add multiple units, delete specific ones, or clear the entire list.
* **Download:** Save your work as a `config.json` file, ready to be added to your game.

### 2. Sprite Editor (.txt)
This tool generates the `.txt` config strings needed for individual animations.

* **Define Paths:** Set the `Character Folder Name`, `Animation Name`, and `Image File Prefix`.
* **Configure:** Set the `Frame Count` and file extension.
* **Position:** Adjust the `X`, `Y`, and `Scale` of the sprite.
* **Live Preview:** An optional, built-in p5.js canvas to preview your animations in real-time.

---

## 🚀 How to Use

1.  Download or clone this repository.
2.  Open the `index.html` file in your browser (using a local server like VS Code's "Live Server" is recommended).
3.  Use the tabs to switch between the **Unit Editor** and **Sprite Editor**.

### How to Use the Live Preview

The live preview is optional and requires setup:

1.  Copy the `data` folder from your main game project.
2.  Paste this `data` folder into the root of this editor's project folder (alongside `index.html`).
3.  Go to the **Sprite Editor (.txt)** tab and fill in the animation details (e.g., `Warrior`, `Idle`, `Warrior_Idle_`, `6`).
4.  Check the **"Enable Live Preview"** box.
5.  Your animation will appear in the preview box.
