require('dotenv').config({ path: `${__dirname}/../.env` });
const nodemailer = require("nodemailer");

const sendEmail = async(receiver, txnHash, fileName, filePath) => {
  console.log(process.env.NODEMAILER_PW);
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,    
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL, 
      pass: process.env.NODEMAILER_PW, 
    },
  });

  const pdfFile = {
      filename: fileName, 
      path: filePath
  }

  const htmlTemplate = `<p>Your transaction hash will serve as a verification tool: ${txnHash}. Present this to future employer.</p>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL, // sender address
    to: receiver, // list of receivers
    subject: "Your Graduation Certificate", // Subject line
    text: "Your transaction hash will serve as a verification tool: " + txnHash + '. Present this to future employer.', // plain text body
    html: htmlTemplate, // html body
    attachments: pdfFile
  });

  console.log("Message sent: " + info.messageId);
  
}
//sendEmail("khairul.azman.rahmat@gmail.com", "transactionhash");
module.exports = sendEmail;

