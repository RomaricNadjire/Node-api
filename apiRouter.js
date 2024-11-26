const express = require("express");
const usersCtrl = require("./Routes/usersCtrl");
const { validateToken } = require("./utils/jwt.utils");

// Server instantiation
exports.router = (function () {
  const router = express.Router();
  // Route to handle GET requests at the root URL ("/")
  router.route("/register").post(usersCtrl.register);
  router.route("/login").post(usersCtrl.login);
  router.route("/profile").get(validateToken, usersCtrl.getProfile);

  return router;
})();
