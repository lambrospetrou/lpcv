const {chromium} = require('playwright');
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

// Delay for 1 second until the server starts.
setTimeout((async () => { 
    try {
        console.info('Generating PDF using Puppeteer...');
        await generatePdf();
        console.info('Generating PDF using Playwright...');
        await generatePdfPlaywright();
        console.info('Generated all PDFs.')
        
        server.close();
        process.exit(0);
    } catch (e) {
        console.error(e); 
    }
}), 1000);

async function generatePdf() {
    // WSL on Windows fails to create a sandbox... 
    // https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
    // https://github.com/loteoo/hyperstatic/pull/20/files 
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process']});
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

    await browser.close();
}

async function generatePdfPlaywright() {
    // WSL on Windows fails to create a sandbox... 
    // https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
    // https://github.com/loteoo/hyperstatic/pull/20/files 
    const browser = await chromium.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process']});
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:12345', {waitUntil: 'networkidle'});
    await page.pdf({
        path: path.join(WS_BUILD, `cv-playwright.pdf`), 
        format: 'A4',
        margin: {
            top: '0.39in',
            left: '0.39in',
            right: '0.38in',
            bottom: '0.38in'
        }
    });
    await browser.close();
}
