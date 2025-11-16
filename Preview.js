// this file handles the p5.js live preview canvas

let ui = {};
let currentSpriteFrames = [];
let currentFrame = 0;
let canvas;

function setup() {
    let canvasContainer = select('#canvas-container');
    
    // set a fixed canvas size
    canvas = createCanvas(660, 400); 
    canvas.parent(canvasContainer);
    frameRate(10);
    background(50);
    
    // find all the ui elements
    ui.charSelect = select('#char_select');
    ui.animSelect = select('#anim_select');
    ui.frameCount = select('#frame_count');
    ui.posX = select('#pos_x');
    ui.posY = select('#pos_y');
    ui.scale = select('#scale_input');
    ui.previewCheck = select('#enable_preview_check');
    ui.prefixInput = select('#prefix_input');
    ui.extInput = select('#ext_input');

    // attach listeners
    ui.charSelect.input(loadAnimation);
    ui.animSelect.input(loadAnimation);
    ui.frameCount.input(loadAnimation);
    ui.previewCheck.changed(togglePreview);
    ui.prefixInput.input(loadAnimation);
    ui.extInput.changed(loadAnimation);

    togglePreview(); 
}

function draw() {
    if (ui.previewCheck.checked()) {
        background(50);

        let xVal = ui.posX.value() || ui.posX.elt.placeholder;
        let yVal = ui.posY.value() || ui.posY.elt.placeholder;
        let scaleVal = ui.scale.value() || ui.scale.elt.placeholder;
        
        let x = parseFloat(xVal);
        let y = parseFloat(yVal);
        let scale = parseFloat(scaleVal);
        
        if (currentSpriteFrames.length > 0) {
            let img = currentSpriteFrames[currentFrame];
            
            imageMode(CENTER);
            image(img, x, y, img.width * scale, img.height * scale);

            currentFrame = (currentFrame + 1) % currentSpriteFrames.length;
        }
    }
}

function togglePreview() {
    if (ui.previewCheck.checked()) {
        loadAnimation();
    } else {
        background(50);
        currentSpriteFrames = [];
    }
}

function loadAnimation() {
    if (!ui.previewCheck.checked()) {
        currentSpriteFrames = [];
        return;
    }

    let char = ui.charSelect.value() || ui.charSelect.elt.placeholder;
    let anim = ui.animSelect.value() || ui.animSelect.elt.placeholder;
    let frameVal = ui.frameCount.value() || ui.frameCount.elt.placeholder;
    let frameCount = parseInt(frameVal);
    let prefix = ui.prefixInput.value() || ui.prefixInput.elt.placeholder;
    let ext = ui.extInput.value();
    
    currentSpriteFrames = [];
    currentFrame = 0;

    if (!char || !anim || isNaN(frameCount) || frameCount <= 0) {
        return;
    }
    
    let tempFrames = new Array(frameCount);
    let loadedCount = 0;
    let expectedCount = frameCount;
    
    for (let i = 0; i < frameCount; i++) {
        let frameNumber = i + 1;
        
        let path = `data/${char}/${anim}/${prefix}${frameNumber}${ext}`;
        
        loadImage(path, 
            (img) => {
                tempFrames[i] = img;
                loadedCount++;
                if (loadedCount === expectedCount) {
                    currentSpriteFrames = tempFrames;
                }
            }, 
            (err) => {
                console.error(`failed to load: ${path}`); 
                expectedCount--;
                if (loadedCount === expectedCount) {
                    currentSpriteFrames = tempFrames.filter(img => img);
                }
            }
        );
    }
}