const puppeteer = require('puppeteer');
const path = require('path');
const express = require("express");
const fs = require('fs');
const mime = require('mime');


const url = "https://www.ccilindia.com/FPIHome.aspx";
const buttonToClickId = "#btnFPISWH";
const downloadDirectory = path.resolve(__dirname, 'downloaded');
const app = express();
const PORT = process.env.PORT || 2000;


app.get("/", (req, res) => {
    res.send({
        status: true,
        message: "headless service up and running",
        urlToDownloadfile: 'https://headless-download.herokuapp.com/downloadfile'
    })
})

app.get("/downloadfile", async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadDirectory
        })
        await page.goto(url);
        await page.click(buttonToClickId);
        await page.waitFor(1000);
        await browser.close();
        const fileToSend = fs.readdirSync(downloadDirectory)[0];
        let file = fileToSend;
        let filename = path.basename(file);
        file = path.resolve(downloadDirectory, filename);
        const mimetype = mime.getType(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
        setTimeout(() => {
            clearDownloadDirectoryAsynchronusly();
        }, 10000);
    } catch (error) {
        res.send({
            status: false,
            message: error.message
        })
    }

})


app.listen(PORT, () => console.log("Headless Puppeteer file download server up and running on Port - ", +PORT));



const clearDownloadDirectoryAsynchronusly = async () => {
    try {
        fs.readdir(downloadDirectory, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(downloadDirectory, file), err => {
                    if (err) throw err;
                });
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}