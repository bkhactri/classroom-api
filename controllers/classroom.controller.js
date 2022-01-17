const classroomService = require("../services/classroom.service");
const participantService = require("../services/participant.service");

const createNewClass = async (req, res, next) => {
  const data = {
    name: req.body.name,
    section: req.body.section,
    subject: req.body.subject,
    room: req.body.room ? req.body.room : null,
    author: req.user.username,
    authorId: req.user.id,
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
    const classroom = await classroomService.findMyClassById(
      classroomId,
      req.user.id
    );

    if (!classroom) {
      return res.sendStatus(404);
    }

    res.status(200).json(classroom);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getParticipantByClassID = async (req, res, next) => {
  try {
    const classID = req.query.classroomID;
    const participants = await participantService.findByClassID(classID);

    res.status(200).json(participants);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getClassInviteInfo = async (req, res, next) => {
  const { id, code } = req.query;

  try {
    const classroom =
      id && id !== "c"
        ? await classroomService.findById(id)
        : await classroomService.findByClassCode(code);

    if (!classroom) {
      return res.status(400).send("error.noClassFoundWithId");
    }

    const participant = await participantService.findById(
      req.user.id,
      classroom.id
    );
    if (participant) {
      return res.status(400).send("error.alreadyInClassroom");
    }

    const role = classroomService.getClassRole(code, classroom.classCode);
    if (!role) return res.sendStatus(400);

    res
      .status(200)
      .send({ classroomId: classroom.id, classroomName: classroom.name, role });
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const joinClass = async (req, res, next) => {
  const { id, code } = req.query;

  try {
    const classroom = await classroomService.findById(id);
    if (!classroom) return res.sendStatus(400);

    const participant = await participantService.findById(
      req.user.id,
      classroom.id
    );
    if (participant) {
      return res.status(400).send("error.alreadyInClassroom");
    }

    const role = classroomService.getClassRole(code, classroom.classCode);
    if (!role) return res.sendStatus(400);

    await participantService.create(req.user.id, classroom.id, role);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const saveClass = async (req, res, next) => {
  const { classroomId } = req.params;
  const classroom = req.body;

  if (classroomId !== classroom.id) {
    return res.sendStatus(400);
  }

  try {
    await classroomService.updateById(classroomId, classroom);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getAllClasses = async (req, res, next) => {
  try {
    const classrooms = await classroomService.findAll();
    res.status(200).json(classrooms);
  } catch (err) {
    res.sendStatus(404) && next(err);
  }
};

const getClassroomByID = async (req, res, next) => {
  const classroomID = req.params.classroomID;

  try {
    const classroom = await classroomService.findById(classroomID);
    if (!classroom) {
      return res.sendStatus(404);
    }

    res.status(200).json(classroom);
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
  getParticipantByClassID,
  saveClass,
  getAllClasses,
  getClassroomByID,
};
