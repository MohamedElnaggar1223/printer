const express = require('express');
const fs = require('fs');
const puppeteer = require('puppeteer-core')
const chromium = require('chrome-aws-lambda')
const { execFile } = require('child_process')
const ptp = require('pdf-to-printer');
const path = require('path');


const PORT = process.env.PORT || 3001;

const app = express();

const createPDF = async () => {
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent('<h1>Hello, World!</h1>');
    const pdfBuffer = await page.pdf();
    await browser.close();
    return pdfBuffer
}

// const printPDF = async (pdfBuffer) => {
//     const pdfPath = 'output.pdf';
//     writeFileSync(pdfPath, pdfBuffer);

//     execFile('lpr', [pdfPath], (error, stdout, stderr) => {
//         if (error) {
//             console.error('Error printing PDF:', error);
//             return;
//         }
//         console.log('PDF printed:', stdout);
//     })
// }

// app.get('/', async (req, res) => {
//     try
//     {
//         console.log('test')
//         const pdfBuffer = await createPDF();
//         await printPDF(pdfBuffer);
//         res.send('PDF printed!');
//     }
//     catch (error)
//     {
//         console.error('Error creating PDF:', error);
//         res.status(500).send('Error creating PDF');
//     }
// });

app.get('/', async (req, res) => {
    return res.json({ message: 'Hello World' });
})

app.post('/', express.raw({ type: 'application/pdf' }), async (req, res) => {

    const options = {};
    if (req.query.printer) {
        options.printer = req.query.printer;
    }
    const pdfBuffer = await createPDF();
    const pdfPath = 'output.pdf';
    fs.writeFileSync(pdfPath, pdfBuffer);
    //@ts-ignore
    await ptp.print(pdfPath, options);
    fs.unlinkSync(pdfPath);

    res.status(204)
    res.send()
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

module.exports = app;