/**
 * Logic for the Sprite Cutter (.zip) tab
 * Supports multiple spritesheet files with automatic folder structure parsing.
 * Fixes: ZIP download issue by using an empty MIME type to force correct extension.
 */
function initSpriteCutter() {
    // DOM Elements
    const fileInput = document.getElementById('cutter_import');
    const fileNameDisplay = document.getElementById('cutter_file_name');
    
    const calcModeSelect = document.getElementById('calc_mode');
    const spriteWidthInput = document.getElementById('sprite_width');
    const spriteHeightInput = document.getElementById('sprite_height');
    const rowsInput = document.getElementById('sprite_rows');
    const colsInput = document.getElementById('sprite_cols');
    
    const downloadButton = document.getElementById('cut_and_download_button');

    // Internal State
    let cutterImages = {}; // Map of {characterFolder/animationName: image}
    let fileMetadata = []; // Array of {file, folder, anim, prefix}

    // --- 2. Grid Calculation Logic ---
    function updateGridCalculations() {
        // Use the first image to calculate grid (applies to all files)
        const firstImage = Object.values(cutterImages)[0];
        if (!firstImage) return;

        const mode = calcModeSelect.value;
        const imgW = firstImage.width;
        const imgH = firstImage.height;

        if (mode === 'count') {
            const rows = parseInt(rowsInput.value);
            const cols = parseInt(colsInput.value);

            if (!isNaN(cols) && cols > 0) {
                spriteWidthInput.value = Math.floor(imgW / cols);
            } else {
                spriteWidthInput.value = '';
            }
            if (!isNaN(rows) && rows > 0) {
                spriteHeightInput.value = Math.floor(imgH / rows);
            } else {
                spriteHeightInput.value = '';
            }
        } 
        else if (mode === 'size') {
            const sw = parseInt(spriteWidthInput.value);
            const sh = parseInt(spriteHeightInput.value);

            if (!isNaN(sw) && sw > 0) {
                colsInput.value = Math.floor(imgW / sw);
            } else {
                colsInput.value = '';
            }
            if (!isNaN(sh) && sh > 0) {
                rowsInput.value = Math.floor(imgH / sh);
            } else {
                rowsInput.value = '';
            }
        }
    }

    function toggleInputState() {
        const mode = calcModeSelect.value;
        rowsInput.value = '';
        colsInput.value = '';
        spriteWidthInput.value = '';
        spriteHeightInput.value = '';

        if (mode === 'count') {
            rowsInput.readOnly = false;
            colsInput.readOnly = false;
            rowsInput.placeholder = "e.g., 8";
            colsInput.placeholder = "e.g., 10";
            spriteWidthInput.readOnly = true;
            spriteHeightInput.readOnly = true;
            spriteWidthInput.placeholder = "(Auto-calc)";
            spriteHeightInput.placeholder = "(Auto-calc)";
        } else {
            spriteWidthInput.readOnly = false;
            spriteHeightInput.readOnly = false;
            spriteWidthInput.placeholder = "e.g., 32";
            spriteHeightInput.placeholder = "e.g., 32";
            rowsInput.readOnly = true;
            colsInput.readOnly = true;
            rowsInput.placeholder = "(Auto-calc)";
            colsInput.placeholder = "(Auto-calc)";
        }
        updateGridCalculations();
    }

    // --- Event Listeners ---
    calcModeSelect.addEventListener('change', toggleInputState);
    rowsInput.addEventListener('input', updateGridCalculations);
    colsInput.addEventListener('input', updateGridCalculations);
    spriteWidthInput.addEventListener('input', updateGridCalculations);
    spriteHeightInput.addEventListener('input', updateGridCalculations);

    // --- Parse filename to extract folder and animation names ---
    function parseFilename(filename) {
        // Expected format: CharacterName_AnimationName_Sheet.ext
        // Example: Warrior_Idle_Sheet.png -> folder: Warrior, anim: Idle
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        const parts = nameWithoutExt.split('_');
        
        if (parts.length >= 3 && parts[parts.length - 1].toLowerCase() === 'sheet') {
            const folder = parts[0];
            const anim = parts[1];
            const prefix = `${folder}_${anim}_`;
            return { folder, anim, prefix };
        }
        
        // Fallback: user will need to set these manually
        return { folder: '', anim: '', prefix: '' };
    }

    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            cutterImages = {};
            fileMetadata = [];
            fileNameDisplay.textContent = 'No files selected.';
            return;
        }

        cutterImages = {};
        fileMetadata = [];
        let loadedCount = 0;

        const processFile = (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const parsed = parseFilename(file.name);
                        const key = `${parsed.folder}/${parsed.anim}`;
                        cutterImages[key] = img;
                        fileMetadata.push({
                            file: file,
                            folder: parsed.folder,
                            anim: parsed.anim,
                            prefix: parsed.prefix,
                            image: img
                        });
                        resolve();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        };

        // Process all files sequentially
        Promise.all(Array.from(files).map(processFile)).then(() => {
            const fileNames = fileMetadata.map(m => m.file.name).join(', ');
            fileNameDisplay.textContent = `${fileNames} (${Object.keys(cutterImages).length} file(s))`;
            updateGridCalculations();
        });
        
        event.target.value = null;
    });

    // --- 3. Download Logic ---
    downloadButton.addEventListener('click', async () => {
        if (Object.keys(cutterImages).length === 0) {
            alert('Please load one or more spritesheet images first.');
            return;
        }

        const mode = calcModeSelect.value;
        
        if (mode === 'count') {
            if (isNaN(parseInt(rowsInput.value)) || parseInt(rowsInput.value) <= 0) {
                alert('Please enter a valid Number of Rows.'); rowsInput.focus(); return;
            }
            if (isNaN(parseInt(colsInput.value)) || parseInt(colsInput.value) <= 0) {
                alert('Please enter a valid Number of Columns.'); colsInput.focus(); return;
            }
        } else {
            if (isNaN(parseInt(spriteWidthInput.value)) || parseInt(spriteWidthInput.value) <= 0) {
                alert('Please enter a valid Sprite Width.'); spriteWidthInput.focus(); return;
            }
            if (isNaN(parseInt(spriteHeightInput.value)) || parseInt(spriteHeightInput.value) <= 0) {
                alert('Please enter a valid Sprite Height.'); spriteHeightInput.focus(); return;
            }
        }

        const sw = parseInt(spriteWidthInput.value);
        const sh = parseInt(spriteHeightInput.value);
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);

        try {
            const zip = new JSZip();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = sw;
            canvas.height = sh;

            // Process each loaded spritesheet
            for (const metadata of fileMetadata) {
                const { folder, anim, prefix, image } = metadata;

                const finalFolder = folder;
                const finalAnim = anim;
                const finalPrefix = prefix;

                if (!finalFolder || !finalAnim || !finalPrefix) {
                    alert(`Could not determine folder/animation names for ${metadata.file.name}. Please ensure filenames follow the pattern: Character_Animation_Sheet.png`);
                    return;
                }

                // Create folder structure: Character/Animation/
                const folderPath = zip.folder(finalFolder).folder(finalAnim);
                let frameNumber = 1;

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const sx = c * sw;
                        const sy = r * sh;

                        if (sx + sw > image.width || sy + sh > image.height) {
                            continue;
                        }

                        ctx.clearRect(0, 0, sw, sh);
                        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);

                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                        const filename = `${finalPrefix}${frameNumber}.png`;
                        folderPath.file(filename, blob);
                        frameNumber++;
                    }
                }
            }

            // Generate ZIP
            const zipContent = await zip.generateAsync({ type: 'blob' });
            
            // Create a filename based on the first character
            let zipFilename = 'sprites.zip';
            if (fileMetadata.length > 0) {
                const firstFolder = fileMetadata[0].folder || 'Character';
                zipFilename = `${firstFolder}.zip`;
            }
            
            // FIX: Pass an EMPTY string for MIME type. 
            // This forces the browser to default to the extension provided in the filename (.zip)
            downloadFile(zipContent, zipFilename, ''); 

        } catch (err) {
            console.error('Error creating zip:', err);
            alert('An error occurred while creating the zip.');
        }
    });

    toggleInputState();
}