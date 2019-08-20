// senhadosendgrid1
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: 'igorssalgado@gmail.com',
    //     subject: 'Thanks for joining in!',
    //     text: `Welcome to the app, ${name}. Let me know how you get alone with the app.`
    // });
    console.log(`Hello ${name}, you have been added to the DB and the email was sent but sendgrid blocked us :-( `);
}

const sendGoodbyeEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: 'igorssalgado@gmail.com',
    //     subject: 'Goodbye',
    //     text: `Good-bye, ${name}. Let me know why you sing off, thankless bastard.`
    // });
    console.log(`Goodbye ${name}!!! see you. I would send an email but sendgrid blocked us.`);
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
