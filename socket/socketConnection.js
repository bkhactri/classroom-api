const { addNewUser, removeUser } = require("../services/socket.service");

exports.socketConnection = (socket) => {
  // console.log("Client connected " + socket.id);

  socket.on("newUser", (userId) => {
    addNewUser(userId.userId, socket.id);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
};
