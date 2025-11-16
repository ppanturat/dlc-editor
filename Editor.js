// this holds the list of units for the .json file
let allUnits = [];
// --- variable to track what's being edited ---
let currentlyEditingIndex = -1; // -1 means "not editing"

// wait for the html document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- tab switching logic ---
    const tabUnit = document.getElementById('tab-unit');
    const tabSprite = document.getElementById('tab-sprite');
    const contentUnit = document.getElementById('unit-editor-content');
    const contentSprite = document.getElementById('sprite-editor-content');

    tabUnit.addEventListener('click', () => {
        contentUnit.style.display = 'block';
        contentSprite.style.display = 'none';
        tabUnit.classList.add('active');
        tabSprite.classList.remove('active');
    });

    tabSprite.addEventListener('click', () => {
        contentUnit.style.display = 'none';
        contentSprite.style.display = 'block';
        tabUnit.classList.remove('active');
        tabSprite.classList.add('active');
    });

    // --- initialize both editors ---
    initSpriteEditor();
    initUnitEditor();

    // set the default tab
    contentUnit.style.display = 'block';
    contentSprite.style.display = 'none';
    
    // --- help modal logic ---
    const helpIcon = document.getElementById('help-icon');
    const modal = document.getElementById('help-modal');
    const closeModal = document.getElementById('close-modal');
    helpIcon.onclick = () => { modal.style.display = 'block'; }
    closeModal.onclick = () => { modal.style.display = 'none'; }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

/**
 * logic for the sprite editor (.txt) tab
 */
function initSpriteEditor() {
    const charSelect = document.getElementById('char_select');
    const animSelect = document.getElementById('anim_select');
    const prefixInput = document.getElementById('prefix_input');
    const extSelect = document.getElementById('ext_input');
    const frameCountInput = document.getElementById('frame_count');
    const posXInput = document.getElementById('pos_x');
    const posYInput = document.getElementById('pos_y');
    const scaleInput = document.getElementById('scale_input');
    const configOutput = document.getElementById('config_output');
    const downloadButton = document.getElementById('download_button');
    const clearSpriteFormButton = document.getElementById('clear_sprite_form');

    function generateConfigString() {
        const char = charSelect.value.trim() || charSelect.placeholder;
        const anim = animSelect.value.trim() || animSelect.placeholder;
        const prefix = prefixInput.value.trim() || prefixInput.placeholder;
        const ext = extSelect.value;
        const frames = frameCountInput.value || frameCountInput.placeholder;
        const x = posXInput.value || posXInput.placeholder;
        const y = posYInput.value || posYInput.placeholder;
        const scale = scaleInput.value || scaleInput.placeholder;
        
        if (charSelect.value.trim() === '' && animSelect.value.trim() === '' && prefixInput.value.trim() === '') {
             configOutput.value = '';
             return;
        }

        const configString = [char, anim, prefix, ext, frames, x, y, scale].join(' ');
        configOutput.value = configString;
    }

    function updatePrefixPlaceholder() {
        const char = charSelect.value.trim() || charSelect.placeholder;
        const anim = animSelect.value.trim() || animSelect.placeholder;
        prefixInput.placeholder = `${char}_${anim}_`;
        generateConfigString();
    }
    
    function clearSpriteForm() {
        charSelect.value = '';
        animSelect.value = '';
        prefixInput.value = '';
        extSelect.value = '.png';
        frameCountInput.value = '';
        posXInput.value = '';
        posYInput.value = '';
        scaleInput.value = '';
        updatePrefixPlaceholder();
    }

    charSelect.addEventListener('input', updatePrefixPlaceholder);
    animSelect.addEventListener('input', updatePrefixPlaceholder);
    prefixInput.addEventListener('input', generateConfigString);
    extSelect.addEventListener('change', generateConfigString);
    frameCountInput.addEventListener('input', generateConfigString);
    posXInput.addEventListener('input', generateConfigString);
    posYInput.addEventListener('input', generateConfigString);
    scaleInput.addEventListener('input', generateConfigString);
    clearSpriteFormButton.addEventListener('click', clearSpriteForm);

    downloadButton.addEventListener('click', () => {
        const configString = configOutput.value;
        if (configString.trim() === '') {
            alert('Config string is empty. Please fill in the fields.');
            return;
        }
        const char = charSelect.value.trim() || charSelect.placeholder;
        const anim = animSelect.value.trim() || animSelect.placeholder;
        const filename = `${char}_${anim}.txt`;
        downloadFile(configString, filename, 'text/plain');
    });

    updatePrefixPlaceholder();
    generateConfigString();
}


/**
 * logic for the unit editor (.json) tab
 */
function initUnitEditor() {
    // form fields
    const unitName = document.getElementById('unit_name');
    const unitHealth = document.getElementById('unit_health');
    const unitAtk = document.getElementById('unit_atk');
    const unitDef = document.getElementById('unit_def');
    const unitDesc = document.getElementById('unit_desc');
    const idleSelect = document.getElementById('unit_idle');
    const attackSelect = document.getElementById('unit_attack');
    const walkSelect = document.getElementById('unit_walk');
    const deathSelect = document.getElementById('unit_death');
    
    // buttons and displays
    const addUnitButton = document.getElementById('add_unit_button');
    const jsonOutput = document.getElementById('unit_json_output');
    const downloadButton = document.getElementById('unit_download_button');
    const importButton = document.getElementById('import_json');
    const clearUnitFormButton = document.getElementById('clear_unit_form');
    
    // edit/delete
    const unitList = document.getElementById('unit_list');
    const deleteUnitButton = document.getElementById('delete_unit_button');
    const deleteAllUnitsButton = document.getElementById('delete_all_units_button');
    const updateUnitButton = document.getElementById('update_unit_button'); // new button
    
    // file display
    const fileNameDisplay = document.getElementById('file_name_display');

    function updateJsonOutput() {
        if (allUnits.length === 0) {
            jsonOutput.value = '';
        } else {
            jsonOutput.value = JSON.stringify({ "units": allUnits }, null, 2);
        }
    }

    function updateUnitList() {
        unitList.innerHTML = '';
        allUnits.forEach((unit, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `(Unit ${index + 1}) ${unit.detail.name}`;
            unitList.appendChild(option);
        });
    }

    function clearUnitForm() {
        unitName.value = '';
        unitHealth.value = '';
        unitAtk.value = '';
        unitDef.value = '';
        unitDesc.value = '';
        idleSelect.value = '';
        attackSelect.value = '';
        walkSelect.value = '';
        deathSelect.value = '';
        
        currentlyEditingIndex = -1; // reset editing state
    }

    function addUnit() {
        if (unitName.value.trim() === '') {
            alert('Please enter a Character Name.');
            unitName.focus();
            return;
        }
        // validation

        const health = unitHealth.value || unitHealth.placeholder;
        const atk = unitAtk.value || unitAtk.placeholder;
        const def = unitDef.value || unitDef.placeholder;

        const newUnit = {
            "detail": { "name": unitName.value, "health": parseInt(health), "atk": parseInt(atk), "def": parseInt(def), "description": unitDesc.value || "No description." },
            "idleConfig": idleSelect.value, "attackConfig": attackSelect.value, "walkConfig": walkSelect.value, "deathConfig": deathSelect.value
        };

        allUnits.push(newUnit);
        updateJsonOutput();
        updateUnitList();
        clearUnitForm();
    }

    function loadJsonFile(event) {
        const file = event.target.files[0];
        if (!file) {
            fileNameDisplay.textContent = 'No file selected.';
            return;
        }
        fileNameDisplay.textContent = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            try {
                const data = JSON.parse(text);
                if (data && data.units && Array.isArray(data.units)) {
                    allUnits = data.units;
                    updateJsonOutput();
                    updateUnitList();
                    alert(`Successfully loaded ${allUnits.length} unit(s) from ${file.name}`);
                } else {
                    alert('Invalid config.json file. Missing "units" array.');
                }
            } catch (err) {
                alert('Error reading file: ' + err.message);
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    }

    /**
     * new function: loads a unit's data into the form for editing
     */
    function loadUnitForEditing() {
        const selectedIndex = unitList.value;
        if (selectedIndex === '') return; // nothing selected

        const index = parseInt(selectedIndex);
        const unit = allUnits[index];
        
        // populate the form
        unitName.value = unit.detail.name;
        unitHealth.value = unit.detail.health;
        unitAtk.value = unit.detail.atk;
        unitDef.value = unit.detail.def;
        unitDesc.value = unit.detail.description;
        idleSelect.value = unit.idleConfig;
        attackSelect.value = unit.attackConfig;
        walkSelect.value = unit.walkConfig;
        deathSelect.value = unit.deathConfig;
        
        // set the editing index
        currentlyEditingIndex = index;
    }
    
    /**
     * new function: saves changes to the currently editing unit
     */
    function updateSelectedUnit() {
        if (currentlyEditingIndex === -1) {
            alert('Please click a unit from the list to load it before updating.');
            return;
        }
        
        // validation (same as addunit)
        if (unitName.value.trim() === '') {
            alert('Please enter a Character Name.');
            unitName.focus();
            return;
        }
        
        // get values from form
        const health = unitHealth.value || unitHealth.placeholder;
        const atk = unitAtk.value || unitAtk.placeholder;
        const def = unitDef.value || unitDef.placeholder;
        
        // create the updated unit object
        const updatedUnit = {
            "detail": { "name": unitName.value, "health": parseInt(health), "atk": parseInt(atk), "def": parseInt(def), "description": unitDesc.value || "No description." },
            "idleConfig": idleSelect.value, "attackConfig": attackSelect.value, "walkConfig": walkSelect.value, "deathConfig": deathSelect.value
        };
        
        // replace the old unit with the new one
        allUnits[currentlyEditingIndex] = updatedUnit;
        
        // refresh everything
        updateJsonOutput();
        updateUnitList();
        clearUnitForm();
    }

    function deleteSelectedUnit() {
        const selectedIndex = unitList.value;
        if (selectedIndex === '') {
            alert('Please select a unit to delete.');
            return;
        }
        
        // if the user deletes the unit they are editing, clear the form
        if (currentlyEditingIndex == selectedIndex) {
            clearUnitForm();
        }
        
        const indexToDelete = parseInt(selectedIndex);
        allUnits.splice(indexToDelete, 1);
        
        // if this messed up the editing index, reset it
        if (currentlyEditingIndex > indexToDelete) {
             currentlyEditingIndex--;
        }

        updateJsonOutput();
        updateUnitList();
    }

    function deleteAllUnits() {
        if (allUnits.length === 0) {
            alert('The list is already empty.');
            return;
        }
        
        if (confirm('Are you sure you want to delete all units? This cannot be undone.')) {
            allUnits = [];
            clearUnitForm();
            updateJsonOutput();
            updateUnitList();
        }
    }

    // --- attach listeners ---
    addUnitButton.addEventListener('click', addUnit);
    importButton.addEventListener('change', loadJsonFile);
    deleteUnitButton.addEventListener('click', deleteSelectedUnit);
    clearUnitFormButton.addEventListener('click', clearUnitForm);
    deleteAllUnitsButton.addEventListener('click', deleteAllUnits);
    updateUnitButton.addEventListener('click', updateSelectedUnit); // new
    unitList.addEventListener('click', loadUnitForEditing); // new

    downloadButton.addEventListener('click', () => {
        if (allUnits.length === 0) {
            alert("No units to download! Click 'Add Unit to JSON' first.");
            return;
        }
        const jsonString = jsonOutput.value;
        downloadFile(jsonString, 'config.json', 'application/json');
    });
}

/**
 * generic helper function to download a file
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}