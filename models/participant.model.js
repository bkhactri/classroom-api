const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const User = require("./user.model");
const Classroom = require("./classroom.model");

const Participant = sequelize.define("participant", {
  role: {
    type: Sequelize.ENUM,
    values: ["OWNER", "TEACHER", "STUDENT"],
    allowNull: false,
  },
});

Participant.sync();

User.belongsToMany(Classroom, { through: Participant, onDelete: "cascade" });
Classroom.belongsToMany(User, { through: Participant, onDelete: "cascade" });

User.hasMany(Participant);
Participant.belongsTo(User);

Classroom.hasMany(Participant);
Participant.belongsTo(Classroom);

module.exports = Participant;
