const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {
  console.log('signup reached ! ');
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(() => {
        const userId = user._id;
        const token = jwt.sign({ userId: userId }, "RANDOM_TOKEN_SECRET", {
          expiresIn: "24h",
        });
        res.status(201).json({
          message: "User added successfully!",
          userId: userId,
          token: token
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  });
};

exports.login = (req, res, next) => {
  console.log('login reached ! ');
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error("User not found!"),
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error("Incorrect mail or password!"),
            });
          }
          const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          });
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.createUser = (req, res, next) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
  });
  newUser
    .save()
    .then((user) => {
      console.log("user created successfully");
      res.status(201).json({ user });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};
