const gradeRequestService = require("../services/grade-request.service");
const gradeService = require("../services/grade.service");
const participantService = require("../services/participant.service");
const userService = require("../services/user.service");
const gradeStructureService = require("../services/grade-structure.service");
const classroomService = require("../services/classroom.service");
const privateMessageService = require("../services/private-message.service");
const socketService = require("../services/socket.service");
const notificationService = require("../services/notification.service");
const {
  resolveRequestNotificationHelper,
} = require("../utils/helper/notificationHelper");
const {
  createRequestNotificationsHelper,
} = require("../utils/helper/notificationHelper");

const getAllRequests = async (req, res, next) => {
  const { classroomId } = req.params;

  try {
    const participant = await participantService.findById(
      req.user.id,
      classroomId
    );
    if (!["OWNER", "TEACHER"].includes(participant?.role)) {
      return res.sendStatus(403);
    }

    const grades = await gradeService.getBoardByClassId(classroomId);

    const findRequests = [];
    grades?.forEach((grade) => {
      if (!grade.point || grade.status === "DRAFT") {
        return;
      }

      findRequests.push(
        gradeRequestService.findLatestOneByIds(
          classroomId,
          grade.gradeStructureId,
          grade.studentIdentificationId
        )
      );
    });

    const gradeRequests = await Promise.all(findRequests);
    res.send(gradeRequests.filter((gr) => gr));
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getSpecificStudentRequests = async (req, res, next) => {
  const { classroomId, gradeStructureId, studentIdentificationId } = req.params;

  try {
    const participant = await participantService.findById(
      req.user.id,
      classroomId
    );
    if (!participant) {
      return res.sendStatus(403);
    }

    const gradeRequests = await gradeRequestService.findManyByIds(
      classroomId,
      gradeStructureId,
      studentIdentificationId
    );
    res.send(gradeRequests);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const createRequest = async (req, res, next) => {
  const { classroomId, gradeStructureId, studentIdentificationId } = req.params;
  const { point, reason } = req.body;

  try {
    const participant = await participantService.findById(
      req.user.id,
      classroomId
    );
    if (participant?.role !== "STUDENT") {
      return res.sendStatus(403);
    }

    const gradeRequest = await gradeRequestService.create(
      { classroomId, gradeStructureId, studentIdentificationId },
      { point, reason }
    );

    const grade = await gradeStructureService.findById(gradeStructureId);
    const classroom = await classroomService.findById(classroomId);
    const gradeName = grade.dataValues.name;
    const className = classroom.dataValues.name;

    const { message, link } = createRequestNotificationsHelper(
      {
        className,
        gradeName
      },
      {
        classroomId,
        studentId: studentIdentificationId,
        gradeStructureId
      }
    );

    const participants = await participantService.findByClassID(classroomId);
    const teacherIds = participants
      .filter((p) => ["OWNER", "TEACHER"].includes(p.role))
      .map((p) => p.userId);

    const promises = teacherIds.map((userId) => {
      return notificationService.createNotification(userId, message, link);
    });

    const result = await Promise.all(promises);

    const onlineUsers = await socketService.getUserOnlineById(teacherIds);
    const onlineUserIds = onlineUsers.map((user) => user.socketId);

    if (onlineUserIds.length) {
      req.app.io.to(onlineUserIds).emit("createReviewRequest", { result });
    }

    res.send(gradeRequest);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateRequest = async (req, res, next) => {
  const {
    classroomId,
    gradeStructureId,
    studentIdentificationId,
    gradeRequestId,
  } = req.params;
  const { resolveStatus } = req.body;

  try {
    const participant = await participantService.findById(
      req.user.id,
      classroomId
    );
    if (!["OWNER", "TEACHER"].includes(participant?.role)) {
      return res.sendStatus(403);
    }

    const gradeRequest = await gradeRequestService.update(
      {
        gradeRequestId,
        classroomId,
        gradeStructureId,
        studentIdentificationId,
      },
      { resolveStatus, resolverId: req.user.id }
    );

    const grade = await gradeStructureService.findById(gradeStructureId);
    const classroom = await classroomService.findById(classroomId);
    const gradeName = grade.dataValues.name;
    const className = classroom.dataValues.name;

    const { message, link } = resolveRequestNotificationHelper(
      className,
      gradeName,
      classroomId,
      gradeStructureId
    );

    const students = await userService.findByStudentIds(studentIdentificationId);
    const userId = students[0].id;

    const result = await notificationService.createNotification(userId, message, link);

    const onlineUsers = await socketService.getUserOnlineById(userId);
    const onlineUserIds = onlineUsers.map((user) => user.socketId);

    if (onlineUserIds.length) {
      req.app.io.to(onlineUserIds).emit("gradeReviewResolved", { result: [result] });
    }

    res.send(gradeRequest[1][0].get());
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getRequestMessages = async (req, res, next) => {
  const { classroomId, gradeStructureId, studentIdentificationId } = req.params;

  try {
    const participant = await participantService.findById(
      req.user.id,
      classroomId
    );

    switch (participant?.role) {
      case "STUDENT":
        const userInfo = await userService.getAccountInfo(req.user.id);
        if (userInfo.studentId !== studentIdentificationId) {
          return res.sendStatus(403);
        }
      case "OWNER":
      case "TEACHER":
        const messages = await privateMessageService.findByIds(
          classroomId,
          gradeStructureId,
          studentIdentificationId
        );
        res.send(messages);

        break;
      default:
        return res.sendStatus(403);
    }
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const createRequestMessage = async (req, res, next) => {
  const { classroomId, gradeStructureId, studentIdentificationId } = req.params;
  const { privateMessage } = req.body;

  try {
    const participant = await participantService.findById(
      req.user.id,
      classroomId
    );

    switch (participant?.role) {
      case "STUDENT":
        const userInfo = await userService.getAccountInfo(req.user.id);
        if (userInfo.studentId !== studentIdentificationId) {
          return res.sendStatus(403);
        }
      case "OWNER":
      case "TEACHER":
        const message = await privateMessageService.createRequestMessage(
          { classroomId, gradeStructureId, studentIdentificationId },
          { message: privateMessage, senderId: req.user.id }
        );
        res.send(message);

        break;
      default:
        return res.sendStatus(403);
    }
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

module.exports = {
  getAllRequests,
  getSpecificStudentRequests,
  createRequest,
  updateRequest,
  getRequestMessages,
  createRequestMessage
};
