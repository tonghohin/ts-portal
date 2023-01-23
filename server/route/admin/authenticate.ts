require("dotenv");
import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

interface Authentication {
  readonly username: string;
  readonly isAdmin: boolean;
}

router.route("/authenticate").get((req: Request, res: Response) => {
  try {
    if (req.headers.authorization) {
      const token: string = req.headers.authorization.split(" ")[1];

      jwt.verify(token, process.env.SECRET, (err: Error, decoded: Authentication) => {
        if (err) throw err;

        console.log("admin decoded", decoded);
        if (decoded) {
          res.json({ isAuthenticated: true, username: decoded.username, isAdmin: decoded.isAdmin });
        } else {
          res.json({ isAuthenticated: false });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
