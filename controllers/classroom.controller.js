const classroomService = require("../services/classroom.service");
const participantService = require("../services/participant.service");

const createNewClass = async (req, res, next) => {
  const data = {
    name: req.body.name,
    section: req.body.section,
    subject: req.body.subject,
    room: req.body.room ? req.body.room : null,
    author: req.user.username,
  };

  try {
    const result = await classroomService.create(data);

    await participantService.create(req.user.id, result.id, "OWNER");

    const updatedClassroom = await classroomService.generateClassCodeAndSave(
      result
    );

    res.status(201).send(updatedClassroom);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getClasses = async (req, res, next) => {
  try {
    const classes = await classroomService.findMyClasses(req.user.id);
    res.status(200).json(classes);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getClass = async (req, res, next) => {
  const classroomId = req.params.classroomId;

  try {
    const classroom = await classroomService.findMyClassById(classroomId);

    if (!classroom) {
      return res.sendStatus(404);
    }

    if (classroom.participants.some((p) => req.user.id === p.userId)) {
      res.status(200).json(classroom);
    } else {
      return res.status(403).send("You are not in this classroom");
    }
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getClassInviteInfo = async (req, res, next) => {
  const { code } = req.query;

  try {
    const classroom = await classroomService.findByClassCode(code);
    if (!classroom) {
      return res.status(400).send("No class found with the provided code");
    }

    const participant = await participantService.findById(req.user.id, classroom.id);
    if (participant) {
      return res.status(400).send("You are already in the classroom");
    }

    const role = classroomService.getClassRole(code, classroom.classCode);
    if (!role) return res.sendStatus(400);

    res.status(200).send({ classroomId: classroom.id , classroomName: classroom.name, role });
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const joinClass = async (req, res, next) => {
  const { id, code } = req.query;

  try {
    const classroom = await classroomService.findById(id);
    if (!classroom) return res.sendStatus(400);

    const participant = await participantService.findById(req.user.id, classroom.id);
    if (participant) {
      return res.status(400).send("You are already in the classroom");
    }

    const role = classroomService.getClassRole(code, classroom.classCode);
    if (!role) return res.sendStatus(400);

    await participantService.create(req.user.id, classroom.id, role);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

module.exports = {
  createNewClass,
  getClasses,
  getClass,
  getClassInviteInfo,
  joinClass,
};
