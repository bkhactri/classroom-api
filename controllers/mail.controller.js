const { sendInvite } = require("../utils/config/nodemailer.config");

const sendInviteToStudents = async (req, res, next) => {
  const { classroomId, classCode, emails } = req.body;
  const inviteLink = `${process.env.CLIENT_HOST}/join/${classroomId}/${classCode}`;

  if (!Array.isArray(emails)) return res.sendStatus(400);

  try {
    const mailingResult = await sendInvite(emails, 'Invitation to become a student', 'student', inviteLink);

    res.status(200).send(mailingResult);
  } catch(err) {
    res.sendStatus(500) && next(err);
  }
}

const sendInviteToTeachers = async (req, res, next) => {
  const { classroomId, classCode, emails } = req.body;

  const temp = classCode.split("").reverse();
  const teacherCode = temp
    .slice(parseInt(classCode.length / 2))
    .concat(temp.slice(0, parseInt(classCode.length / 2)))
    .map((char) => {
      if (char === 'Z') {
        return String.fromCharCode(char.charCodeAt() - 1);
      }
      return String.fromCharCode(char.charCodeAt() + 1);
    })
    .join("");

  const inviteLink = `${process.env.CLIENT_HOST}/join/${classroomId}/${teacherCode}`;

  if (!Array.isArray(emails)) return res.sendStatus(400);

  try {
    const mailingResult = await sendInvite(emails, 'Invitation to become a teacher', 'teacher', inviteLink);

    res.status(200).send(mailingResult);
  } catch(err) {
    res.sendStatus(500) && next(err);
  }
}

module.exports = {
  sendInviteToStudents,
  sendInviteToTeachers
}