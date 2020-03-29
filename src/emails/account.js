const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=> {
    sgMail.send({
        to: email,
        from: "iamsrizon@gmail.com",
        subject: "Thanks for joining us!",
        text: `Welcome to the app, ${name}. Get ready to access the amazing recipes.`
    })
}

const sendCancellationEmail = (email, name)=> {
    sgMail.send({
        to: email,
        from: "iamsrizon@gmail.com",
        subject: "Sorry, you are leaving us!",
        text: `We are sorry that you are leaving, ${name}. Please let us know how we can improve`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}