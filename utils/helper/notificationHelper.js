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
};

const resolveRequestNotificationHelper = (
  className,
  gradeName,
  classroomId,
  gradeStructureId
) => {
  const message = `[${className}] Your grade review request of ${gradeName} has been resolved`;
  const link = `/classroom/${classroomId}/myGrades?gradeStructureId=${gradeStructureId}`;

  return { message, link };
};

const replyStudentGradeReviewNotificationHelper = (
  className,
  gradeName,
  classroomId
) => {
  const message = `[${className}] Teacher has replied on your ${gradeName} grade request`;
  const link = `/classroom/${classroomId}/myGrades`;

  return { message, link };
};

const replyTeacherGradeReviewNotificationHelper = (
  className,
  gradeName,
  classroomId
) => {
  const message = `[${className}] Student has replied on ${gradeName} grade request`;
  const link = `/classroom/${classroomId}/grades`;

  return { message, link };
};

module.exports = {
  finalizedNotificationsHelper,
  createRequestNotificationsHelper,
  resolveRequestNotificationHelper,
  replyStudentGradeReviewNotificationHelper,
  replyTeacherGradeReviewNotificationHelper,
};
