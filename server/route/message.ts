import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const Message = require("../mongo/schema/Message.js");

interface Message {
  readonly _id: string;
  readonly name: string;
  readonly unit: string;
  readonly subject: string;
  readonly message: string;
  readonly reply?: string;
  createdAt: string;
  updatedAt: string;
  readonly __v: number;
}

router
  .route("/message")
  .get((req: Request, res: Response) => {
    Message.find({}, (err: Error, result: Message[]) => {
      if (err) throw err;
      res.send(result);
    }).sort({ createdAt: -1 });
  })
  .post((req: Request, res: Response) => {
    console.log(req.body);
    Message.create(req.body, (err: Error, result: unknown) => {
      if (err) throw err;
      console.log(result);
      res.send("Message sent! We'll get back to you asap!.");
    });
  });

router
  .route("/message/:_id")
  .get((req: Request, res: Response) => {
    Message.find({ unit: req.params._id }, (err: Error, result: Message[]) => {
      if (err) throw err;
      res.send(result);
    }).sort({ createdAt: -1 });
  })
  .put((req: Request, res: Response) => {
    Message.updateOne(req.params, req.body, (err: Error, result: unknown) => {
      if (err) throw err;
      console.log(result);
      res.end();
    });
  });

module.exports = router;
