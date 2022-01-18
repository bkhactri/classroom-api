const finalizedNotificationsHelper = (className, gradeName, classroomId) => {
  const message = `[${className}] Your ${gradeName} grade has been finalized`;
  const link = `/classroom/${classroomId}/myGrades`;

  return { message, link };
};

const createRequestNotificationsHelper = (names, ids) => {
  const { className, gradeName } = names;
  const { classroomId, studentId, gradeStructureId } = ids;

  const message = `[${className}] Student ${studentId} request a review for grade ${gradeName}`;
  const link = `/classroom/${classroomId}/grades?gradeStructureId=${gradeStructureId}&studentId=${studentId}`;

  return { message, link };
}

module.exports = {
  finalizedNotificationsHelper,
  createRequestNotificationsHelper
};
