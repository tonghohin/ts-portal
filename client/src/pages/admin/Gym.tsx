import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import GymCalendar from "../../components/admin/gym/GymCalendar";

export interface GymScheduleTimeslot {
  readonly _id: string;
  readonly time: string;
  readonly slotOne: string;
  readonly slotThree: string;
  readonly slotTwo: string;
}
export interface GymSchedule {
  readonly _id: string;
  date: string;
  readonly timeslot: GymScheduleTimeslot[];
}
export interface ContextmenuInfo {
  isShown: boolean;
  textIsClosed: boolean;
}
export interface Timeslot {
  coor: { x: number; y: number };
  id: string;
  text: string;
}

function Gym() {
  const [gymSchedule, setGymSchedule] = useState<GymSchedule[]>([]);
  const [toggleRerender, setToggleRerender] = useState<boolean>(false);
  const [contextmenuInfo, setContextmenuInfo] = useState<ContextmenuInfo>({ isShown: false, textIsClosed: true });
  const [clickedTimeslot, setClickedTimslot] = useState<Timeslot>({ coor: { x: 0, y: 0 }, id: "", text: "" });

  useEffect(() => {
    window.addEventListener("click", () => {
      setContextmenuInfo({ isShown: false, textIsClosed: true });
    });
  }, []);

  useEffect(() => {
    fetch("/admin/gym")
      .then((res: Response) => res.json())
      .then((data: GymSchedule[]) => {
        data.map((obj: GymSchedule) => (obj.date = new Date(obj.date).toDateString()));
        setGymSchedule(data);
      })
      .catch((err) => console.log(err));
  }, [toggleRerender]);

  return (
    <>
      <main className="p-5 bg-gray-100 overflow-auto">
        <h1 className="text-xl font-semibold">Gymroom Schedule</h1>
        <section className="grid grid-cols-5 bg-white rounded border-2">
          {gymSchedule.map((day) => (
            <GymCalendar key={day._id} date={day.date.slice(0, 10)} day={day} setContextmenuInfo={setContextmenuInfo} setClickedTimslot={setClickedTimslot} />
          ))}
        </section>
      </main>
      {contextmenuInfo.isShown && <Contextmenu contextmenuInfo={contextmenuInfo} clickedTimeslot={clickedTimeslot} setToggleRerender={setToggleRerender} />}
    </>
  );
}

interface Props {
  contextmenuInfo: ContextmenuInfo;
  clickedTimeslot: Timeslot;
  setToggleRerender: React.Dispatch<React.SetStateAction<boolean>>;
}

function Contextmenu(props: Props) {
  async function handleClick(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    try {
      await fetch(`/admin/gym/${props.clickedTimeslot.id}/${props.clickedTimeslot.text}`, { method: "PUT", body: JSON.stringify({ action: e.currentTarget.textContent }), headers: { "Content-Type": "application/json" } });
      props.setToggleRerender((prevToggleRerender) => !prevToggleRerender);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <button className="bg-white border border-slate-500 px-1 rounded fixed hover:bg-slate-300" style={{ left: props.clickedTimeslot.coor.x, top: props.clickedTimeslot.coor.y }} onClick={handleClick}>
      {props.contextmenuInfo.textIsClosed ? "Set to 'Closed'" : "Set to 'Available'"}
      {props.contextmenuInfo.textIsClosed ? <NoSymbolIcon className="h-5 w-5 inline ml-2 mb-1 text-red-600" /> : <CheckIcon className="h-5 w-5 inline ml-2 mb-1 text-green-600" />}
    </button>
  );
}

export default Gym;
