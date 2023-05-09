const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: user.gmailAccount,
        pass: config.GmailAppPassword
    }
});