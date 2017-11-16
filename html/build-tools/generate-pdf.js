const puppeteer = require('puppeteer');

//////////////// Start a server to serve the local built CV
const serve = require('serve');
const path = require('path');

const server = serve(path.join(__dirname, "../build"), {
    port: 12345,
    silent: true
});

console.info("Generating PDF...");

setTimeout(() => generatePdf(server), 1000);

/// Do the PDF printing!

async function generatePdf(server) {
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('http://127.0.0.1:12345', {waitUntil: 'networkidle2'});
await page.pdf({
    path: 'cv.pdf', 
    format: 'A4',
    margin: {
        top: "0.39in",
        left: "0.39in",
        right: "0.38in",
        bottom: "0.38in"
    }
});

browser.close();

// Close the server hosting the CV
server.stop();

}
