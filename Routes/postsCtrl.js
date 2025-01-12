const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");

// Routes
module.exports = {
  add: [
    // Validation des champs
    body("title").isString().isLength({ min: 2, max: 50 }),
    body("content").isString().isLength({ min: 2, max: 500 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content } = req.body;

      try {
        const post = await models.Post.create({
          title,
          content,
          userId: req.user.id,
        });

        res.status(201).json({
          message: "Post created successfully",
          post,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating post" });
      }
    },
  ],

  gerUserPosts: async (req, res) => {
    const posts = await models.Post.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    return res.status(200).json(posts);
  },

  getAll: async (req, res) => {
    const posts = await models.Post.findAll({
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    return res.status(200).json(posts);
  },
};
