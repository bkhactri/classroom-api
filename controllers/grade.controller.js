const gradeStructureService = require("../services/grade-structure.service");
const participantService = require("../services/participant.service");

const getGradeStructures = async (req, res, next) => {
  const classroomId = req.params.classroomId;

  try {
    const participant = await participantService.findById(req.user.id, classroomId);

    if (['OWNER', 'TEACHER'].includes(participant.role)) {
      const gradeStructures = await gradeStructureService.getAll(classroomId);

      return res.send(gradeStructures);
    }

    res.sendStatus(400);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
}

const createGradeStructure = async (req, res, next) => {
  const data = {
    name: req.body.name,
    point: req.body.point
  };
  const classroomId = req.body.classroomId;

  try {
    const participant = await participantService.findById(req.user.id, classroomId);

    if (['OWNER', 'TEACHER'].includes(participant.role)) {
      const gradeStructure = await gradeStructureService.create(data, classroomId);

      return res.status(201).send(gradeStructure);
    }

    res.sendStatus(400);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
}

const updateGradeStructure = async (req, res, next) => {
  const gradeStructureId = req.params.gradeStructureId; 

  if (gradeStructureId !== req.body.id) {
    return res.sendStatus(400);
  }

  // No need to touch 'order' or 'classroomId' when update individually
  const gradeStructure = {
    name: req.body.name,
    point: req.body.point
  }

  try {
    await gradeStructureService.updateById(gradeStructureId, gradeStructure);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
}

const updateMultipleGradeStructures = async (req, res, next) => {
  try {
    const updateRequests = [];
    req.body.gradeStructures.forEach((gradeStructure) => {
      updateRequests.push(gradeStructureService.updateById(gradeStructure.id, gradeStructure));
    })

    await Promise.all(updateRequests);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
}

const deleteGradeStructure = async (req, res, next) => {
  const gradeStructureId = req.params.gradeStructureId; 

  try {
    await gradeStructureService.deleteById(gradeStructureId);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
}

module.exports = {
  getGradeStructures,
  createGradeStructure,
  updateGradeStructure,
  updateMultipleGradeStructures,
  deleteGradeStructure
}
