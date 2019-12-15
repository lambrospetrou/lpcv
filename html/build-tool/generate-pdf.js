const puppeteer = require('puppeteer');
const handler = require('serve-handler');
const http = require('http');
const path = require('path');

const WS_BUILD=path.join(__dirname, '../build');

const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/zeit/serve-handler#options
    return handler(request, response, {
        public: WS_BUILD
    });
})
server.listen(12345)

console.info('Generating PDF...');

setTimeout(() => generatePdf(server), 1000);

/// Do the PDF printing!

async function generatePdf(server) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:12345', {waitUntil: 'networkidle2'});
    await page.pdf({
        path: path.join(WS_BUILD, 'cv.pdf'), 
        format: 'A4',
        margin: {
            top: '0.39in',
            left: '0.39in',
            right: '0.38in',
            bottom: '0.38in'
        }
    });

    browser.close();

    // Close the server hosting the CV
    server.close();
}
