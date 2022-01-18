const Grade = require("../models/grade.model");
const { Op } = require("sequelize");
const papaparse = require("papaparse");
const fs = require("fs");

const gradeByStudentId = async (data) => {
  try {
    return await Grade.upsert(
      {
        point: data.gradePoint,
        status: data.status,
        classroomId: data.classroomId,
        gradeStructureId: data.gradeId,
        studentIdentificationId: data.studentId,
      },
      { returning: true, raw: true }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};

const getBoardByClassId = async (classroomId) => {
  try {
    return await Grade.findAll({
      where: {
        classroomId: classroomId,
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const finalizedColumn = async (data) => {
  try {
    return await Grade.update(
      { status: "FINALIZED" },
      {
        where: {
          [Op.and]: [
            { classroomId: data.classroomId },
            { gradeStructureId: data.gradeId },
          ],
        },
        returning: true,
        raw: true,
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};
const getCSVTemplate = (studentIds) => {
  const data = [["Student ID", "Point"]];
  studentIds.forEach((id) => data.push([id]));
  const csv = papaparse.unparse(data);

  return csv;
};

const csv2JSON = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) return reject(err);
      const output = papaparse.parse(data);
      resolve(output);
    });
  });
};

const updateFromCsv = (
  csvResult,
  gradeStructureId,
  classroomId,
  maximumPoint
) => {
  const firstField =
    csvResult.data[0][0] === "Student ID" ? "studentIdentificationId" : "point";
  const secondField =
    firstField === "studentIdentificationId"
      ? "point"
      : "studentIdentificationId";
  const pointIndex = firstField === "studentIdentificationId" ? 1 : 0;

  console.log("h=>", maximumPoint);

  const updateRequests = [];
  csvResult.data
    .filter((item) => {
      return item[0] && item[1];
    })
    .forEach((item, index) => {
      if (index === 0 || Number(item[pointIndex]) > Number(maximumPoint)) {
        return;
      }

      updateRequests.push(
        Grade.upsert({
          [firstField]: item[0],
          [secondField]: item[1],
          gradeStructureId,
          classroomId,
        })
      );
    });

  return Promise.all(updateRequests);
};

const getBoardByClassIdAndStructureId = async (
  classroomId,
  gradeStructureId
) => {
  try {
    return await Grade.findAll({
      where: {
        classroomId,
        gradeStructureId,
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const getCSVGrade = (grades, students, headers) => {
  const initData = [headers];
  grades.forEach((item) => {
    if (item?.studentIdentificationId) {
      initData.push([item.studentIdentificationId, item.point || ""]);
    }
  });

  const dataToParse = initData.concat(
    students
      .filter(
        (student) => !initData.map((data) => data[0])?.includes(student.id)
      )
      .map((student) => [student.id])
  );

  const csv = papaparse.unparse(dataToParse);

  return csv;
};

const getGradesForStudent = async (classroomId, studentIdentificationId) => {
  try {
    return await Grade.findAll({
      where: {
        classroomId,
        studentIdentificationId,
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  gradeByStudentId,
  getBoardByClassId,
  finalizedColumn,
  getCSVTemplate,
  csv2JSON,
  updateFromCsv,
  getBoardByClassIdAndStructureId,
  getCSVGrade,
  getGradesForStudent,
};
