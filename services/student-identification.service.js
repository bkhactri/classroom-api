const papaparse = require("papaparse");
const fs = require("fs");
const StudentIdentification = require("../models/student-idenfication.model");

const getCSVTemplate = () => {
  const csv = papaparse.unparse([["Student ID", "Fullname"]]);

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

const updateFromCsv = (csvResult, classroomId) => {
  const recordNumber = csvResult.data.length;
  const firstField = csvResult.data[0][0] === "Student ID" ? "id" : "name";
  const secondField = firstField === "id" ? "name" : "id";

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
        StudentIdentification.upsert({
          [firstField]: item[0],
          [secondField]: item[1],
          classroomId,
        })
      );
    });

  return Promise.all(updateRequests);
};

const getStudentsByClassId = async (classroomId) => {
  try {
    return await StudentIdentification.findAll({
      where: {
        classroomId,
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getCSVTemplate,
  csv2JSON,
  updateFromCsv,
  getStudentsByClassId,
};
