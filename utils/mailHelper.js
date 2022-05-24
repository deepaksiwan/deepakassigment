const nodemailer = require('nodemailer');
const mailHelper = async(options) =>{

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
       
        auth: {
          user: process.env.SMTP_USER, // generated ethereal user
          pass: process.env.SMTP_PASS, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
        await transporter.sendMail({
        from: 'satyendra@cozy.dev', // sender address
        to: options.toEmail, // list of receivers
        subject:options.subject, // Subject line
        text: options.message, // plain text body
       
      }).then(() => {
        console.log("Mail sent");
      }).catch(error => console.log(error));
}

module.exports = mailHelper;