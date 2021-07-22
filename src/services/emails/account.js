const sgMail = require("@sendgrid/mail");
const daysBetween = require("../../utils/days_between");

//Set SgMail
sgMail.setApiKey(process.env.SENDGRID_KEY);

const from = "dosanjos.thomas@gmail.com";

module.exports.sendWelcomeMail = async (to, name) => {
  await sgMail.send({
    to,
    from,
    subject: "Welcome aboard",
    text: `Hello ${name} and welcome aboard the hype train`,
  });
};

module.exports.sendCancelMail = async (to, name, dateSub) => {
  const date = daysBetween(dateSub);

  await sgMail.send({
    to,
    from,
    subject: "We are very sad you're leaving us !",
    text: `Good Bye ${name} its been exceptional ${date} days with you`,
  });
};
