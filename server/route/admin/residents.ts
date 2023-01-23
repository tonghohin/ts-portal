import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Resident = require("../../mongo/schema/Resident");

interface Resident {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly unit: string;
  readonly password: string;
  readonly __v: number;
}

router
  .route("/resident")
  .get((req: Request, res: Response) => {
    Resident.find({}, (err: Error, result: Resident[]) => {
      if (err) throw err;
      res.json(result);
    });
  })
  .post((req: Request, res: Response) => {
    Object.keys(req.body).forEach((key) => (req.body[key] = req.body[key].trim()));
    bcrypt.hash(req.body.password, 10, (err: Error, hash: string) => {
      req.body.password = hash;
      Resident.create(req.body, (err: Error, result: unknown) => {
        if (err) throw err;
        console.log(result);
        res.send("The resident has been added.");
      });
    });
  });

router
  .route("/resident/:_id")
  .put((req: Request, res: Response) => {
    Resident.find(req.params, (err: Error, result: Resident[]) => {
      if (err) throw err;
      if (result[0].firstName === req.body.firstName && result[0].lastName === req.body.lastName && result[0].unit === req.body.unit) {
        res.send("Nothing is updated.");
      } else {
        Resident.updateOne(req.params, { firstName: req.body.firstName, lastName: req.body.lastName, unit: req.body.unit }, (err: Error, result: unknown) => {
          if (err) throw err;
          console.log(result);
          res.send("The resident is updated.");
        });
      }
    });
  })
  .delete((req: Request, res: Response) => {
    Resident.deleteOne(req.params, (err: Error, result: unknown) => {
      if (err) throw err;
      console.log(result);
      res.send("The resident is deleted.");
    });
  });

module.exports = router;
