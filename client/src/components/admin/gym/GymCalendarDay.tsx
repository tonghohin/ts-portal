import { ContextmenuInfo, Timeslot } from "../../../pages/admin/Gym";
import { useRef } from "react";

interface Props {
  readonly dayId: string;
  readonly time: string;
  readonly slotOne: string;
  readonly slotTwo: string;
  readonly slotThree: string;
  readonly setContextmenuInfo: React.Dispatch<React.SetStateAction<ContextmenuInfo>>;
  readonly setClickedTimslot: React.Dispatch<React.SetStateAction<Timeslot>>;
}

function GymCalendarDay(props: Props) {
  const P = useRef<HTMLParagraphElement>(null);

  function handleContextmenu(e: React.MouseEvent<HTMLHeadingElement>) {
    e.preventDefault();

    if (P.current && e.currentTarget.textContent) {
      P.current.textContent === "Closed" ? props.setContextmenuInfo({ isShown: true, textIsClosed: false }) : props.setContextmenuInfo({ isShown: true, textIsClosed: true });
      props.setClickedTimslot({ coor: { x: e.clientX, y: e.clientY }, id: e.currentTarget.id, text: e.currentTarget.textContent });
    }
  }

  return (
    <div>
      <h1 className="bg-slate-200 font-semibold cursor-pointer hover:bg-slate-300" id={props.dayId} onContextMenu={handleContextmenu}>
        {props.time}
      </h1>
      <p className={switchClass(props.slotOne)} ref={P}>
        {props.slotOne}
      </p>
      <p className={switchClass(props.slotTwo, true)}>{props.slotTwo}</p>
      <p className={switchClass(props.slotThree)}>{props.slotThree}</p>
    </div>
  );
}

function switchClass(text: string, isMiddle: boolean = false) {
  switch (text) {
    case "Closed":
      return "bg-gray-400";
    case "Available":
      return isMiddle ? "bg-slate-100" : undefined;
    default:
      return isMiddle ? "bg-slate-100 font-semibold underline" : "font-semibold underline";
  }
}

export default GymCalendarDay;
