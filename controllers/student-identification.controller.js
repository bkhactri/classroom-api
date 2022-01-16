const studentIdentificationService = require("../services/student-identification.service");
const userService = require("../services/user.service");
const path = require("path");
const fs = require("fs");

const getTemplate = async (req, res, next) => {
  try {
    res.send(studentIdentificationService.getCSVTemplate());
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const uploadFile = async (req, res, next) => {
  const fileInfo = req.files.file[0];
  const filePath = path.join(process.cwd(), fileInfo.path);

  try {
    const csvResult = await studentIdentificationService.csv2JSON(filePath);

    await studentIdentificationService.updateFromCsv(
      csvResult,
      req.body.classroomId
    );

    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });

    const resData = csvResult.data.slice(1, csvResult.data.length - 1);

    res.status(200).send(resData);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getStudentsInClass = async (req, res, next) => {
  const { classroomId } = req.params;

  try {
    const students = await studentIdentificationService.getStudentsByClassId(
      classroomId
    );

    res.status(200).send(students);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getStudentById = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const accountInfo = await userService.getAccountInfo(req.user.id);

    if (accountInfo.studentId !== studentId) {
      return res.sendStatus(403);
    }

    const student = await studentIdentificationService.getStudentById(studentId);

    res.status(200).send(student);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
}

module.exports = {
  getTemplate,
  uploadFile,
  getStudentsInClass,
  getStudentById
};
