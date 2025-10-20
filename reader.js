// pull reader class from demo, must be changed in submodule to export
import { Reader } from './foliate-js/reader.js';

const DEBUG_OUT = true;

// get book URL, maybe put this in a POST request later
const params = new URLSearchParams(location.search);
const bookURL = params.get('src');
if (DEBUG_OUT)
    console.log("book URL: " + bookURL);

// if we're not coming from a redirect, show file opener
if (!bookURL)
    document.getElementById('drop-target').hidden = false;

// fetch book and pass to reader
// TODO: loading bar
fetch(bookURL)
    .then((response) => response.blob())
    .then((bookBlob) => {
        // get filename from URL
        const filename = new URL(bookURL).pathname.split('/').pop();
        if (DEBUG_OUT)
            console.log("book filename: " + filename);

        // convert blob to File and pass to foliate-js reader script
        const bookFile = new File([bookBlob], filename);
        const reader = new Reader();
        reader.open(bookFile);
    });
// TODO: localStorage choice for paginated vs scrolled reader