const puppeteer = require('puppeteer');

(async() => {

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://www.lambrospetrou.com/cv/', {waitUntil: 'networkidle2'});
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
})();
