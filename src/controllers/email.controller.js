import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

const mailOptions = (receiver) => {
    return {
        from: "Coder Test " + config.gmailAccount,
        to: receiver,
        subject: "Prueba de envio de mail!",
        html: "<div><h1>Esta es una prueba de envio de mail!</h1></div>",
        attachments: []
    }
}


export const sendEmail = (req, res) => {
    try {
        const { email } = req.user
        let finalEmail = email ? email : config.gmailAccount;
        let result = transporter.sendMail(mailOptions(finalEmail), (error, info) => {
            if (error) {
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success!", payload: info });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "Could not send email from:" + config.gmailAccount });
    }
};