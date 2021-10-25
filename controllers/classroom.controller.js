const classroomService = require("../services/classroom.service");

const createNewClass = async (req, res, next) => {
  const data = {
    name: req.body.name,
    section: req.body.section,
    subject: req.body.subject,
    room: req.body.room ? req.body.room : null,
    author: req.body.author,
  };

  try {
    const result = await classroomService.create(data);
    res.status(201).send(result);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getClasses = async (req, res, next) => {
  try {
    const classes = await classroomService.findAll();
    res.status(200).json(classes);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getClass = async (req, res, next) => {
  const classroomId = req.params.classroomId;
  try {
    const classroom = await classroomService.findById(classroomId);
    res.status(200).json(classroom);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

module.exports = {
  createNewClass,
  getClasses,
  getClass,
};
