import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../../mongo/schema/Admin");

interface Admin {
  readonly _id: string;
  readonly username: string;
  readonly password: string;
  readonly __v: number;
}

router.route("/register").post((req: Request, res: Response) => {
  Admin.find({ username: req.body.username }, (err: Error, result: Admin[]) => {
    if (err) throw err;
    if (result.length === 0) {
      bcrypt.hash(req.body.password, 10, (err: Error, hash: string) => {
        if (err) throw err;
        Admin.create({ username: req.body.username, password: hash });
      });
      res.json({ isNewAccountRegistered: true });
    } else {
      res.json({ isUsernameExist: true });
    }
  });
});

module.exports = router;
