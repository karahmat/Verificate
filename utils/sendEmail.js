require('dotenv').config({ path: `${__dirname}/../.env` });
const nodemailer = require("nodemailer");
const QRCode = require('qrcode');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
global.appRoot = path.resolve(__dirname);

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const sendEmail = async(receiverEmail, receiverName, txnHash, pdfFileRaw, rootServer) => {
  console.log(pdfFileRaw);
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    service: 'yahoo',
    port: 465,    
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL, 
      pass: process.env.NODEMAILER_PW, 
    },
    logger: true
  });

  console.log("After email transporter created")
  
  //To create QR code file
  const qrCodeFile = `${appRoot}/../uploads/${Date.now()}_qrcode.png`;

  console.log("qrCodeFile", qrCodeFile);

  await QRCode.toFile(qrCodeFile, `${rootServer}/${txnHash}`);
  // rootServer = http://domain.name.com/documents/testnet (whereby testnet refers to either {localhost, goerli, mainnet}, where the smart contract is deployed)    
  // upload the QR code to cloudinary and optain the url of the stored file. I have to do this since most web email like Google Mail cannot read base64 images.
  const {url} = await cloudinary.uploader.upload(qrCodeFile);

  const pdfFile = {
    filename: pdfFileRaw.filename, 
    path: pdfFileRaw.path
  }

  console.log("url of QRcode", url);
  
  const htmlTemplate = `
  <p>Dear ${receiverName}, </p>
  <p>Congratulations on your graduation! Your PDF certificate is attached. </p>
  <p>Your certificate has also been stored on the Ethereum blockchain with the following transaction hash: ${txnHash}. With this, your certificate can never be tampered with. </p>
  <p>You can ask your future employers to either click on this <a href="${rootServer}/${txnHash}">link</a> or scan the QR code below to verify the certificate</p>
  <img src=${url} alt="qr code image" />
  `;
  
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL, // sender address
    to: receiverEmail, // list of receivers
    subject: "Your Graduation Certificate", // Subject line
    text: "Dear " + receiverName + ", Congratulations on your graduation. Your transaction hash will serve as a verification tool: " + txnHash + '. Link to QR Code: ' + url, // plain text body
    html: htmlTemplate, // html body
    attachments: pdfFile
  });

  console.log("Message sent: " + info.messageId);
  fs.unlinkSync(qrCodeFile);
  
}
//sendEmail("khairul.azman.rahmat@gmail.com", "transactionhash");
module.exports = sendEmail;

