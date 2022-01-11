const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.MAIL_CLIENTID,
  process.env.MAIL_CLIENTSECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.MAIL_REFRESHTOKEN,
});
const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  pool: true,
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_ADDRESS,
    clientId: process.env.MAIL_CLIENTID,
    clientSecret: process.env.MAIL_CLIENTSECRET,
    refreshToken: process.env.MAIL_REFRESHTOKEN,
    accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const checkMailConnection = () => {
  transporter.verify((err, success) => {
    if (err) console.log(err);
    if (success) console.log("Server is ready to handle mail");
  });
};

/**
 *
 * @param {*} recipients An array of recipients
 * @param {*} subject The subject of the mail
 * @param {*} htmlContent The content of the mail written with html
 */
const sendMail = async (recipients, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: recipients,
    subject,
    html: htmlContent,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 *
 * @param {*} recipients An array of recipients
 * @param {*} subject The subject of the mail
 * @param {*} role
 * @param {*} inviteLink
 */
const sendInvite = async (recipients, subject, role, inviteLink) => {
  const htmlContent =
    `<p>Hello from Virtual Classroom,</p>` +
    `<p>A user from our service has invited you to become a <strong>${role}</strong> in their classroom.</p>` +
    `<p>Please click the link below to see more details:</p>` +
    `<p><a href="${inviteLink}" target="_blank">${inviteLink}</a></p><br />` +
    `<h3>Virtual Class</h3>`;

  return await sendMail(recipients, subject, htmlContent);
};

const sendRefreshPasswordEmail = async (recipient, resetLink) => {
  const subject = "Reset Password for iClassroom";
  const htmlContent = `
  <h4>Hi ${recipient}</h4>
  <p style="margin-bottom: 30px;">You recently request to reset your password for your iClassroom account.<br> Click the button below to reset it</p>
  <a style="background: #111;
      height: 60px;
      padding: 10px 43px;
      border: 0;
      color: #fff;
      text-transform: capitalize;
      cursor: pointer;
      font-size: 16px;
      border-radius: 0px;
      margin-left: 100px;
      text-decoration:none;" href="${resetLink}">Reset your password</a>
  <p style="margin-top:30px">If you did not request a password reset, please ignore this email.<br>This password reset is only valid for the next 1 hour</p>
  <p style="margin-top: 40px;">Thanks.<br>Admin eClassroom</p>
  `;

  return await sendMail(recipient, subject, htmlContent);
};

const sendVerifyMail = async (recipient, verifyLink) => {
  const subject = "Verify Email for iClassroom";
  const htmlContent = `
  <h4>Verify your email to finish signing up for eClassroom</h4>
  <p style="margin-top: 30px;">Thanks yor for joining eClassroom.
  <br>Please confirm that ${recipient} is your email address by clicking on the button below
  <br>This link will expire after 1 hour</p>
  <a style="background: #111;
      height: 60px;
      padding: 10px 43px;
      border: 0;
      color: #fff;
      text-transform: capitalize;
      cursor: pointer;
      font-size: 16px;
      border-radius: 0px;
      margin-left: 100px;
      text-decoration:none;" href="${verifyLink}">Verify now</a>
  <p style="margin-top: 40px;">Thanks.<br>Admin eClassroom</p>`;

  return await sendMail(recipient, subject, htmlContent);
};

module.exports = {
  checkMailConnection,
  sendInvite,
  sendRefreshPasswordEmail,
  sendVerifyMail,
};
