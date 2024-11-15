const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");

// Middleware to validate JWT tokens

// Routes
module.exports = {
  register: [
    // Validation des champs
    body("username")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email")
      .isEmail()
      .withMessage("Email is not valid")
      .custom(async (value) => {
        const user = await models.User.findOne({
          attributes: ["email"],
          where: { email: value },
        });
        if (user) {
          throw new Error("Email already in use");
        }
      }),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),

    // Fonction de gestion de l'inscription
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      try {
        const hash = await bcrypt.hash(password, 10);
        const user = await models.User.create({
          username,
          email,
          password: hash,
        });

        res.status(201).json({
          message: "User created successfully",
          token: jwtUtils.generateToken(user),
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating user" });
      }
    },
  ],

  login: [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
        const user = await models.User.findOne({
          attributes: ["id", "email", "password"],
          where: { email },
        });

        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwtUtils.generateToken(user);

        res.status(200).json({ message: "User logged in successfully", token });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error logging in user" });
      }
    },
  ],
};