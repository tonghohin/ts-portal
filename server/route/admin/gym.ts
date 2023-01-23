import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const Gym = require("../../mongo/schema/Gym");

export interface GymScheduleTimeslot {
  readonly _id: string;
  readonly time: string;
  readonly slotOne: string;
  readonly slotThree: string;
  readonly slotTwo: string;
}
export interface Gym {
  readonly _id: string;
  date: string;
  readonly timeslot: GymScheduleTimeslot[];
}

router.route("/gym").get((req: Request, res: Response) => {
  Gym.find({}, (err: Error, result: Gym[]) => {
    if (err) throw err;
    res.json(result);
  });
});

router.route("/gym/:id/:timeslot").put((req: Request, res: Response) => {
  if (req.body.action === "Set to 'Closed'") {
    Gym.updateOne({ _id: req.params.id }, { "timeslot.$[elem].slotOne": "Closed", "timeslot.$[elem].slotTwo": "Closed", "timeslot.$[elem].slotThree": "Closed" }, { arrayFilters: [{ "elem.time": req.params.timeslot }] }, (err: Error, result: unknown) => {
      if (err) throw err;
      console.log(result);
      res.end();
    });
  } else if (req.body.action === "Set to 'Available'") {
    Gym.updateOne({ _id: req.params.id }, { "timeslot.$[elem].slotOne": "Available", "timeslot.$[elem].slotTwo": "Available", "timeslot.$[elem].slotThree": "Available" }, { arrayFilters: [{ "elem.time": req.params.timeslot }] }, (err: Error, result: unknown) => {
      if (err) throw err;
      console.log(result);
      res.end();
    });
  }
});

module.exports = router;
