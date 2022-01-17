const finalizedNotificationsHelper = (className, gradeName, classroomId) => {
  const message = `[${className}] Your ${gradeName} grade has been finalized`;
  const link = `/classroom/${classroomId}/myGrades`;

  return { message, link };
};

module.exports = {
  finalizedNotificationsHelper,
};
