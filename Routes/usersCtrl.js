const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwtUtils = require("../utils/jwt.utils");
const models = require("../models");

// Routes
module.exports = {
  register: [
    // Validation des champs
    body("name")
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage("name must be at least 3 characters long"),
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
      .isAlphanumeric()
      .withMessage("Password must be at least 8 characters long"),

    // Fonction de gestion de l'inscription
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      try {
        const hash = await bcrypt.hash(password, 10);
        const user = await models.User.create({
          name,
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

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await models.User.findOne({
        attributes: ["id", "email", "password"],
        where: { email: email },
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

  getProfile: async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  },
};
