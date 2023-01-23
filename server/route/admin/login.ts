require("dotenv");
import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../mongo/schema/Admin");

interface Admin {
  readonly _id: string;
  readonly username: string;
  readonly password: string;
  readonly __v: number;
}

router.route("/login").post((req: Request, res: Response) => {
  Admin.find({ username: req.body.username }, (err: Error, user: Admin[]) => {
    if (err) throw err;
    if (user.length === 0) {
      res.json({ isInvalidUsernameOrPassword: true });
    } else {
      bcrypt.compare(req.body.password, user[0].password, (err: Error, result: boolean) => {
        if (err) throw err;
        if (result) {
          jwt.sign({ username: user[0].username, isAdmin: true }, process.env.SECRET, { expiresIn: 86400 }, (err: Error, token: string) => {
            if (err) throw err;
            res.json({ token: token });
          });
        } else {
          res.json({ isInvalidUsernameOrPassword: true });
        }
      });
    }
  });
});

module.exports = router;
