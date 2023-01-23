import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const Announcement = require("../mongo/schema/Announcement");

interface Announcement {
  readonly _id: string;
  readonly subject: string;
  readonly announcement: string;
  createdAt: string;
  updatedAt: string;
  readonly __v: number;
}

router
  .route("/announcement")
  .get((req: Request, res: Response) => {
    Announcement.find({}, (err: Error, result: Announcement[]) => {
      if (err) throw err;
      res.send(result);
    });
  })
  .post((req: Request, res: Response) => {
    Announcement.create(req.body, (err: Error, result: unknown) => {
      if (err) throw err;
      console.log(result);
      res.send("The announcement has been published.");
    });
  });

router.route("/announcement/:_id").put((req: Request, res: Response) => {
  console.log(req.body);
  Announcement.find(req.params, (err: Error, result: Announcement[]) => {
    if (err) throw err;
    if (result[0].announcement === req.body.announcement && result[0].subject === req.body.subject) {
      res.end();
    } else {
      Announcement.updateOne(req.params, req.body, (err: Error, result: unknown) => {
        if (err) throw err;
        console.log(result);
        res.send("The announcement has been edited.");
      });
    }
  });
});

module.exports = router;
