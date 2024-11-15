const express = require("express");
const usersCtrl = require("./Routes/usersCtrl");

// Server instantiation
exports.router = (function () {
  const router = express.Router();
  // Route to handle GET requests at the root URL ("/")
  router.route("/register").post(usersCtrl.register);
  router.route("/login").post(usersCtrl.login);

  return router;
})();
