import './style.css';
import { Editor } from 'pixlr-sdk';

// SERVER URL vite dev in development and /api in production
const SERVER_URL = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';

const frame = document.getElementById('mainIframe') as HTMLIFrameElement;
const fileInput = document.getElementById('add-file-input') as HTMLInputElement;

let editor: Editor;

fileInput.addEventListener('change', async (event) => {
  const response = await fetch(`${SERVER_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
  const token = response?.token;

  if (!token) throw new Error('No token');

  const files = (event.target as HTMLInputElement).files!;
  if (files.length > 0) {
    const file = files[0]; // Use the first file for this example

    if (!editor) {
      // Connect to the Pixlr editor
      editor = await Editor.connect(token, frame, {
        baseUrl: 'https://pixlr.com', // Optional: Custom base URL for the editor
      });
    }

    // Open the file in the editor
    for await (const newFile of editor.open(file)) {
      console.log(newFile);
    }
  }
});
