const url = "https://www.ccilindia.com/FPIHome.aspx";
const buttonToClickId = "#btnFPISWH";

const puppeteer = require('puppeteer');
const path = require('path');
const express = require("express");

const app = express();


// app.get("/downloadfile", async (req, res) => {
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: path.resolve(__dirname, 'downloaded')
    })
    await page.goto(url);
    console.log("Clicking Download Button...");
    await page.click(buttonToClickId);
    await page.waitFor(5000);
    await browser.close();
})();

// })