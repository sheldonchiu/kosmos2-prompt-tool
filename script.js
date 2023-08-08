let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let rect = {};
let drag = false;
let img = new Image();
let naturalWidth, naturalHeight; // global variables

let phraseInput = document.getElementById('phrase-input');
let addButton = document.getElementById('add_bbox');
let outputDiv = document.getElementById('bbox_output');
let phrase = phraseInput.value;
let lastIndices = null;


phraseInput.addEventListener('input', function () {
    phrase = this.value;
});

let pInput = document.getElementById('p-input');
let P = parseInt(pInput.value);

pInput.addEventListener('input', function () {
    P = parseInt(this.value);
});

function get_index_from_box_coords(P, box_coords) {
    let cell_size = 1.0 / P;

    // Compute the x and y indices of the upper-left and lower-right corners of the bounding box  
    let ul_x = Math.floor(box_coords[0] / cell_size);
    let ul_y = Math.floor(box_coords[1] / cell_size);

    let lr_x = Math.floor(box_coords[2] / cell_size) - 1;
    let lr_y = Math.floor(box_coords[3] / cell_size) - 1;

    // Compute the upper-left and lower-right indices of the bounding box  
    let ul_idx = ul_y * P + ul_x;
    let lr_idx = lr_y * P + lr_x;

    // Format indices to 4 digits with 0 padding
    ul_idx = ul_idx.toString().padStart(4, '0');
    lr_idx = lr_idx.toString().padStart(4, '0');

    return [ul_idx, lr_idx];
}

canvas.addEventListener('mousedown', function (e) {
    let scaleWidth = canvas.width / naturalWidth;
    let scaleHeight = canvas.height / naturalHeight;

    let x = (e.pageX - this.offsetLeft) / scaleWidth;
    let y = (e.pageY - this.offsetTop) / scaleHeight;

    if (x < 0 || x > naturalWidth || y < 0 || y > naturalHeight) {
        // Don't start the rectangle if the mouse is outside of the image.
        return;
    }

    rect.startX = x;
    rect.startY = y;
    drag = true;
});

addButton.addEventListener('click', function () {
    if (lastIndices) {
        let outputLine = `<phrase>${phrase}</phrase><object><patch_index_${lastIndices[0]}><patch_index_${lastIndices[1]}></object>`;
        let p = document.createElement('p');
        p.textContent = outputLine;
        outputDiv.appendChild(p);
        lastIndices = null;
    }
});

canvas.addEventListener('mouseup', function (e) {
    drag = false;
    let scaleWidth = canvas.width / naturalWidth;
    let scaleHeight = canvas.height / naturalHeight;

    let x = (e.pageX - this.offsetLeft) / scaleWidth;
    let y = (e.pageY - this.offsetTop) / scaleHeight;

    x = Math.min(Math.max(x, 0), naturalWidth);  // Ensure x is within the image.
    y = Math.min(Math.max(y, 0), naturalHeight); // Ensure y is within the image.

    // Get normalized indices
    lastIndices = get_index_from_box_coords(P, [rect.startX / naturalWidth, rect.startY / naturalHeight, x / naturalWidth, y / naturalHeight]);
    let ul_idx = lastIndices[0];
    let lr_idx = lastIndices[1];

    // Display the object information
    document.getElementById("coordinates_display").textContent = `Upper left: (${parseInt(rect.startX)}, ${parseInt(rect.startY)}), Bottom right: (${parseInt(x)}, ${parseInt(y)})`;
    document.getElementById("patch_index_display").textContent = `Kosmos2: <object><patch_index_${ul_idx}><patch_index_${lr_idx}></object>`;
});

canvas.addEventListener('mousemove', function (e) {
    if (drag) {
        let scaleWidth = canvas.width / naturalWidth;
        let scaleHeight = canvas.height / naturalHeight;

        let x = (e.pageX - this.offsetLeft) / scaleWidth;
        let y = (e.pageY - this.offsetTop) / scaleHeight;

        x = Math.min(Math.max(x, 0), naturalWidth);  // Ensure x is within the image.
        y = Math.min(Math.max(y, 0), naturalHeight); // Ensure y is within the image.

        rect.w = Math.min(x - rect.startX, naturalWidth - rect.startX);
        rect.h = Math.min(y - rect.startY, naturalHeight - rect.startY);

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // redraw the image
        ctx.strokeRect(rect.startX * scaleWidth, rect.startY * scaleHeight, rect.w * scaleWidth, rect.h * scaleHeight); // draw the rectangle
    }
});

document.getElementById("image-input").addEventListener("change", function (e) {
    let reader = new FileReader();
    reader.onload = function (event) {
        img.onload = function () {
            // Store natural dimensions
            naturalWidth = img.width;
            naturalHeight = img.height;

            // Define maximum width and height
            const maxDisplayWidth = 500; // replace with your desired max width
            const maxDisplayHeight = 500; // replace with your desired max height

            // Calculate scale maintaining aspect ratio
            let scale = Math.min(maxDisplayWidth / naturalWidth, maxDisplayHeight / naturalHeight);

            // Calculate scaled image dimensions
            let scaledWidth = naturalWidth * scale;
            let scaledHeight = naturalHeight * scale;

            // Set canvas width and height
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

