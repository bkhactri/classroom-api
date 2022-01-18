const gradeService = require("../services/grade.service");
const gradeStructureService = require("../services/grade-structure.service");
const participantService = require("../services/participant.service");
const studentIdentificationService = require("../services/student-identification.service");
const notificationService = require("../services/notification.service");
const userService = require("../services/user.service");
const socketService = require("../services/socket.service");
const classroomService = require("../services/classroom.service");
const {
  finalizedNotificationsHelper,
} = require("../utils/helper/notificationHelper");
const path = require("path");
const fs = require("fs");

const getGradeStructures = async (req, res, next) => {
  const classroomId = req.params.classroomId;

  try {
    const gradeStructures = await gradeStructureService.getAll(classroomId);

    return res.status(200).send(gradeStructures);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const createGradeStructure = async (req, res, next) => {
  const data = {
    name: req.body.name,
    point: req.body.point,
  };
  const classroomId = req.body.classroomId;

  try {
    const participant = await participantService.findById(
      req.user.id,
      classroomId
    );

    if (["OWNER", "TEACHER"].includes(participant.role)) {
      const gradeStructure = await gradeStructureService.create(
        data,
        classroomId
      );

      return res.status(201).send(gradeStructure);
    }

    res.sendStatus(400);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateGradeStructure = async (req, res, next) => {
  const gradeStructureId = req.params.gradeStructureId;

  if (gradeStructureId !== req.body.id) {
    return res.sendStatus(400);
  }

  // No need to touch 'order' or 'classroomId' when update individually
  const gradeStructure = {
    name: req.body.name,
    point: req.body.point,
  };

  try {
    await gradeStructureService.updateById(gradeStructureId, gradeStructure);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateMultipleGradeStructures = async (req, res, next) => {
  try {
    const updateRequests = [];
    req.body.gradeStructures.forEach((gradeStructure) => {
      updateRequests.push(
        gradeStructureService.updateById(gradeStructure.id, gradeStructure)
      );
    });

    await Promise.all(updateRequests);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const deleteGradeStructure = async (req, res, next) => {
  const gradeStructureId = req.params.gradeStructureId;

  try {
    await gradeStructureService.deleteById(gradeStructureId);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const gradeDraftSingleCell = async (req, res, next) => {
  try {
    const serviceResponse = await gradeService.gradeByStudentId(req.body);

    res.send(serviceResponse?.[0]);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getGradeBoard = async (req, res, next) => {
  const { classroomId } = req.params;
  try {
    const queryData = await gradeService.getBoardByClassId(classroomId);
    if (queryData) {
      res.status(200).send(queryData);
    }
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const finalizedGradeColumn = async (req, res, next) => {
  try {
    const grade = await gradeStructureService.findById(req.body.gradeId);
    const classroom = await classroomService.findById(req.body.classroomId);
    const gradeName = grade.dataValues.name;
    const className = classroom.dataValues.name;

    const queryResult = await gradeService.finalizedColumn(req.body);
    const studentIds = queryResult[1].map(
      (student) => student.studentIdentificationId
    );

    const users = await userService.findByStudentIds(studentIds);
    const userIds = users.map((user) => user.id);

    const { message, link } = finalizedNotificationsHelper(
      className,
      gradeName,
      req.body.classroomId
    );

    const promises = userIds.map((id) => {
      return notificationService.createNotification(id, message, link);
    });

    const result = await Promise.all(promises);

    const onlineUsers = await socketService.getUserOnlineById(userIds);
    const onlineUserIds = onlineUsers.map((user) => user.socketId);

    if (onlineUserIds.length > 0) {
      req.app.io.to(onlineUserIds).emit("gradeFinalized", { result });
    }
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getTemplate = async (req, res, next) => {
  const classroomId = req.params.classroomId;

  try {
    const studentIdentifications =
      await studentIdentificationService.getStudentsByClassId(classroomId);
    res.send(
      gradeService.getCSVTemplate(
        studentIdentifications.map((stdId) => stdId.id)
      )
    );
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const uploadFile = async (req, res, next) => {
  const fileInfo = req.files.file[0];
  const filePath = path.join(process.cwd(), fileInfo.path);

  try {
    const csvResult = await gradeService.csv2JSON(filePath);
    const gradeStructure = await gradeStructureService.findById(
      req.body.gradeStructureId
    );

    await gradeService.updateFromCsv(
      csvResult,
      req.body.gradeStructureId,
      req.body.classroomId,
      gradeStructure.point
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

const exportGradeColumn = async (req, res, next) => {
  const { classroomId, gradeStructureId } = req.params;

  try {
    const grades = await gradeService.getBoardByClassIdAndStructureId(
      classroomId,
      gradeStructureId
    );
    const studentIdentifications =
      await studentIdentificationService.getStudentsByClassId(classroomId);

    res.send(
      gradeService.getCSVGrade(grades, studentIdentifications, [
        "Student ID",
        "Point",
      ])
    );
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getGradesForStudent = async (req, res, next) => {
  const { classroomId, studentIdentificationId } = req.params;

  try {
    const grades = await gradeService.getGradesForStudent(
      classroomId,
      studentIdentificationId
    );

    res.send(grades);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

module.exports = {
  getGradeStructures,
  createGradeStructure,
  updateGradeStructure,
  updateMultipleGradeStructures,
  deleteGradeStructure,
  gradeDraftSingleCell,
  getGradeBoard,
  finalizedGradeColumn,
  getTemplate,
  uploadFile,
  exportGradeColumn,
  getGradesForStudent,
};
