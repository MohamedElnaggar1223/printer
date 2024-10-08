const express = require('express');
const fs = require('fs');
const chrome = require('@sparticuz/chromium')
const puppeteer = require('puppeteer-core')
const { print, getPrinters } = require('unix-print');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

const createPDF = async () => {
    try
    {
        const executablePath = await chrome.executablePath()

        console.log('executablePath:', executablePath)

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                ...chrome.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu',
            ],
            executablePath,
        })
        // const browser = await puppeteer.launch({
        //     args: [...chrome.args],
        //     defaultViewport: chrome.defaultViewport,
        //     executablePath,
        //     headless: false,
        // })
        const page = await browser.newPage();
        await page.setContent('<h1>Hello, World!</h1>');
        const pdfBuffer = await page.pdf();
        await browser.close();
        return pdfBuffer;
    }
    catch (error)
    {
        console.error('Error creating PDF:', error);
        throw error;
    }
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
//         res.send('PDF printed!')
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
    try
    {
        const options = {};
        if (req.query.printer) {
            options.printer = String(req.query.printer);
            console.log('printer:', options.printer)
        }
        const pdfBuffer = await createPDF();
        console.log('pdf buffer created')
        const pdfPath = path.join('/tmp', 'output.pdf');
        fs.writeFileSync(pdfPath, pdfBuffer);
        console.log('pdf file created')
        const printers = await getPrinters();
        console.log('printers:', printers.length)
        printers.map(printer => console.log(printer.printer))
        await print(pdfPath, 'RICOH Aficio SP 3510DN');
        console.log('pdf printed')
        fs.unlinkSync(pdfPath);
    
        res.status(204)
        res.send()
    }
    catch (error)
    {
        console.error('Error creating PDF:', error);
        res.status(500).send(`Error creating PDF: ${error}`);
    }
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
})

module.exports = app;