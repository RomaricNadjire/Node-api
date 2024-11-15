const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = require("crypto").randomBytes(64).toString("hex");

module.exports = {
  generateToken: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
        username: userData.username,
        email: userData.email,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  },
};

function validateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}
