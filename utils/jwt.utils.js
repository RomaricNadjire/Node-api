const jwt = require("jsonwebtoken");
const models = require("../models");

const JWT_SECRET_KEY =
  "eyJ1c2VySWQiOjEsImlhdCI6MTczMjA0NDYwNiwiZXhwIjoxNzMyMDQ4MjA2fQ";

module.exports = {
  generateToken: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
        username: userData.username,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  },

  validateToken: async function (req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const user = await models.User.findOne({
        attributes: ["id", "username", "email"],
        where: { id: decoded.userId ?? -1 },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: "Invalid token" });
    }
  },
};
