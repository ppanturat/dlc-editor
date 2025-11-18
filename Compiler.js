function initCompiler() {
    const jsonInput = document.getElementById('compiler_json');
    const txtInput = document.getElementById('compiler_txt');
    const zipInput = document.getElementById('compiler_zip');
    const compileBtn = document.getElementById('compile_button');
    const statusDiv = document.getElementById('compiler_status');

    // Dynamic File Display Logic
    function setupFileDisplay(inputId, displayId) {
        const input = document.getElementById(inputId);
        const display = document.getElementById(displayId);

        if (!input || !display) return;

        input.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                if (this.files.length === 1) {
                    // Single file
                    display.textContent = `${this.files[0].name}`;
                } else {
                    // Multiple files (for the .txt configs)
                    const names = Array.from(this.files).map(f => f.name).join(', ');
                    display.textContent = `${names} (${this.files.length} file(s))`;
                }
            } else {
                // Reset if canceled
                display.textContent = "No file selected.";
            }
        });
    }

    // Attach the listeners to your HTML IDs
    setupFileDisplay('compiler_json', 'compiler_json_display');
    setupFileDisplay('compiler_txt',  'compiler_txt_display');
    setupFileDisplay('compiler_zip',  'compiler_zip_display');


    // Compile Button Logic (Standard)
    compileBtn.addEventListener('click', async () => {
        // Validation
        if (!jsonInput.files[0]) {
            alert("Error: Please upload a Unit JSON file.");
            return;
        }
        if (txtInput.files.length === 0) {
            alert("Error: Please upload at least one Animation .txt file.");
            return;
        }
        if (!zipInput.files[0]) {
            alert("Error: Please upload the Sprite Images .zip file.");
            return;
        }

        if (typeof JSZip === 'undefined') {
            alert("Error: JSZip library not loaded.");
            return;
        }

        statusDiv.textContent = "Processing... Please wait.";
        
        try {
            const finalZip = new JSZip();
            
            // Add Unit JSON
            const jsonFile = jsonInput.files[0];
            const jsonText = await readFileAsText(jsonFile);
            finalZip.file(jsonFile.name, jsonText);

            // Get Name for filename
            let charName = "Character";
            try {
                const jsonObj = JSON.parse(jsonText);
                if (jsonObj.name) charName = jsonObj.name;
                else if (jsonObj.detail && jsonObj.detail.name) charName = jsonObj.detail.name;
            } catch (e) { console.warn("Could not parse JSON for name"); }

            // Add Text Configs
            for (let i = 0; i < txtInput.files.length; i++) {
                const file = txtInput.files[i];
                const text = await readFileAsText(file);
                finalZip.file(file.name, text);
            }

            // Add Images from ZIP
            const zipFile = zipInput.files[0];
            const loadedZip = await JSZip.loadAsync(zipFile);
            
            const filePromises = [];
            loadedZip.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir) {
                    const promise = zipEntry.async("blob").then(blob => {
                        finalZip.file(relativePath, blob);
                    });
                    filePromises.push(promise);
                }
            });

            await Promise.all(filePromises);

            // Generate and Download
            const content = await finalZip.generateAsync({ type: "blob" });
            const downloadName = `DLC_${charName}.zip`;
            
            // Trigger Download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = downloadName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            statusDiv.textContent = `Success! Downloaded ${downloadName}`;

        } catch (err) {
            console.error(err);
            statusDiv.textContent = "Error during compilation: " + err.message;
        }
    });
}

// Helper
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}