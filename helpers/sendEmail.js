const nodemailer = require("nodemailer");
const { META_KEY, BASE_URL } = require(`../config`);
const sendEmail = async ({ email, verificationToken }) => {
  const config = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: "abumutairshadi@meta.ua",
      pass: META_KEY,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const emailOptions = {
    to: email,
    from: "abumutairshadi@meta.ua",
    subject: "Confirm registration",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Please, confirm your registration by press this reference</a>`,
  };

  console.log(emailOptions);

  await transporter
    .sendMail(emailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

module.exports = sendEmail;
