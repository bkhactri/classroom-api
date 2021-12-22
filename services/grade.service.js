const Grade = require("../models/grade.model");
const { Op } = require("sequelize");
const papaparse = require("papaparse");
const fs = require("fs");

const gradeByStudentId = async (data) => {
  try {
    return await Grade.upsert({
      point: data.gradePoint,
      status: data.status,
      classroomId: data.classroomId,
      gradeStructureId: data.gradeId,
      studentIdentificationId: data.studentId,
    });
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
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};
const getCSVTemplate = () => {
  const csv = papaparse.unparse([["Student ID", "Point"]]);

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

const updateFromCsv = (csvResult, gradeStructureId, classroomId) => {
  const recordNumber = csvResult.data.length;
  const firstField = csvResult.data[0][0] === "Student ID" ? "studentIdentificationId" : "point";
  const secondField = firstField === "studentIdentificationId" ? "point" : "studentIdentificationId";

  const updateRequests = [];
  csvResult.data
    .filter((item) => {
      return item[0] && item[1];
    })
    .forEach((item, index) => {
      if (index === 0) {
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

const getBoardByClassIdAndStructureId = async (classroomId, gradeStructureId) => {
  try {
    return await Grade.findAll({
      where: {
        classroomId,
        gradeStructureId
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

const getCSVGrade = async (data, headers) => {
  const dataToParse = [headers];
  data.forEach((item) => {
    dataToParse.push([item.studentIdentificationId, item.point]);
  })

  const csv = papaparse.unparse(dataToParse);

  return csv;
}

module.exports = {
  gradeByStudentId,
  getBoardByClassId,
  finalizedColumn,
  getCSVTemplate,
  csv2JSON,
  updateFromCsv,
  getBoardByClassIdAndStructureId,
  getCSVGrade
};
