const SESSION_CONFIG = {
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 180 * 60 * 1000,
  },
};

module.exports = {
  SESSION_CONFIG,
};
