# Prompt Tool for Kosmos 2

Prompt Tool for Kosmos 2 is a powerful and intuitive tool that allows you to load images and draw bounding boxes on them. You can annotate these bounding boxes with phrases of your choice. 

## Demo

You can check out the online demo [here](https://sheldonchiu.github.io/kosmos2-prompt-tool/).

## Installation & Running

No installation is required for this tool. Simply clone the repository and run a local server. Here's how you can do it:

1. Clone the repository:
    ```
    git clone https://github.com/sheldonchiu/kosmos2-prompt-tool.git
    ```

2. Navigate to the cloned directory:
    ```
    cd kosmos2-prompt-tool
    ```

3. Run the local server using Python:
    ```
    python3 -m http.server
    ```

After following these steps, you can view the application by visiting `http://localhost:8000` in your web browser.

## Usage

1. Load an image to the canvas using the "Upload Image" button.

2. Draw bounding boxes on the image by clicking and dragging.

3. Enter a phrase in the "Phrase" input field.

4. Click the "Add Bounding Box" button to add the bounding box details and your phrase to the output.

5. Repeat steps 2-4 to add multiple bounding boxes to the output.
