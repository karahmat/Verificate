const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const attachQRCode = async (QRcode, pdfFileRawPath) => {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFileRawPath));
    const img = await pdfDoc.embedPng(fs.readFileSync(QRcode));
    const imagePage = pdfDoc.getPage(0);
    const xx=imagePage.getWidth()
    console.log(imagePage.getHeight())    
    
    imagePage.drawImage(img, {
        x: xx-90,
        y: 20,
        width: 70,
        height: 70 
    });

    const pdfBytes = await pdfDoc.save();
    const newFilePath = `uploads/${path.basename(pdfFileRawPath, '.pdf')}-result.pdf`;
    fs.writeFileSync(newFilePath, pdfBytes);       

    return newFilePath;
}

module.exports = attachQRCode;