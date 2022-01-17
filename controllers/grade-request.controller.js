const gradeRequestService = require("../services/grade-request.service");
const gradeService = require("../services/grade.service");
const participantService = require("../services/participant.service");
const userService = require("../services/user.service");
const privateMessageService = require("../services/private-message.service");

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