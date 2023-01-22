import { ArrowUturnRightIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import UserGymCalendar from "../../components/user/gym/UserGymCalendar";
import { useAppSelector } from "../../app/hooks";

export interface ContextmenuInfo {
  isShown: boolean;
  textIsAvailable: boolean;
}
export interface Timeslot {
  coor: { x: number; y: number };
  id: string;
  text: string;
  slot?: string;
}
interface GymScheduleTimeslot {
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

function UserGym() {
  const userReducer = useAppSelector((store) => store.user);
  const [gymSchedule, setGymSchedule] = useState<GymSchedule[]>([]);
  const [toggleRerender, setToggleRerender] = useState<boolean>(false);
  const [contextmenuInfo, setContextmenuInfo] = useState<ContextmenuInfo>({ isShown: false, textIsAvailable: true });
  const [clickedTimeslot, setClickedTimslot] = useState<Timeslot>({ coor: { x: 0, y: 0 }, id: "", text: "", slot: "" });

  useEffect(() => {
    window.addEventListener("click", () => {
      setContextmenuInfo({ isShown: false, textIsAvailable: true });
    });
  }, []);

  useEffect(() => {
    fetch(`/gymcalendar/${userReducer.unit}`)
      .then((res: Response) => res.json())
      .then((data: GymSchedule[]) => {
        data.map((obj: GymSchedule) => (obj.date = new Date(obj.date).toDateString()));
        setGymSchedule(data);
      })
      .catch((err) => console.log(err));
  }, [toggleRerender, userReducer.unit]);

  return (
    <>
      <main className="p-5 bg-gray-100 overflow-auto">
        <h1 className="text-xl font-semibold">Gymroom Schedule</h1>
        <section className="grid grid-cols-5 bg-white rounded border-2">
          {gymSchedule.map((day) => (
            <UserGymCalendar key={day._id} date={day.date} day={day} setContextmenuInfo={setContextmenuInfo} setClickedTimslot={setClickedTimslot} />
          ))}
        </section>
      </main>
      {contextmenuInfo.isShown && <Contextmenu contextmenuInfo={contextmenuInfo} clickedTimeslot={clickedTimeslot} setToggleRerender={setToggleRerender} />}
    </>
  );
}

interface Props {
  readonly contextmenuInfo: ContextmenuInfo;
  readonly clickedTimeslot: Timeslot;
  readonly setToggleRerender: React.Dispatch<React.SetStateAction<boolean>>;
}

function Contextmenu(props: Props) {
  const userReducer = useAppSelector((store) => store.user);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    try {
      await fetch(`/gym/${props.clickedTimeslot.id}/${props.clickedTimeslot.text}/${props.clickedTimeslot.slot}`, { method: "PUT", body: JSON.stringify({ action: e.currentTarget.textContent, unit: userReducer.unit }), headers: { "Content-Type": "application/json" } });
      props.setToggleRerender((prevToggleRerender) => !prevToggleRerender);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <button className="bg-white border border-slate-500 px-1 rounded fixed hover:bg-slate-300" style={{ left: props.clickedTimeslot.coor.x, top: props.clickedTimeslot.coor.y }} onClick={handleClick}>
      {props.contextmenuInfo.textIsAvailable ? "Register" : "De-register"}
      {props.contextmenuInfo.textIsAvailable ? <CheckIcon className="h-5 w-5 inline ml-2 mb-1 text-green-600" /> : <ArrowUturnRightIcon className="h-5 w-5 inline ml-2 mb-1 text-red-600" />}
    </button>
  );
}

export default UserGym;
