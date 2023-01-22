import { ContextmenuInfo, Timeslot } from "../../../pages/user/UserGym";
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

function UserGymCalendarDay(props: Props) {
  const H1 = useRef<HTMLHeadingElement>(null);

  function handleContextmenu(e: React.MouseEvent<HTMLParagraphElement>) {
    e.preventDefault();
    (e.target as HTMLParagraphElement).textContent === "Available" ? props.setContextmenuInfo({ isShown: true, textIsAvailable: true }) : props.setContextmenuInfo({ isShown: true, textIsAvailable: false });
    if (H1.current && H1.current.textContent) {
      props.setClickedTimslot({ coor: { x: e.clientX, y: e.clientY }, id: H1.current.id, text: H1.current.textContent, slot: (e.target as HTMLParagraphElement).dataset.slot });
    }
  }

  return (
    <div>
      <h1 className="bg-slate-200 font-semibold" id={props.dayId} ref={H1}>
        {props.time}
      </h1>
      <p className={switchClass(props.slotOne)} onContextMenu={props.slotOne === "Closed" || props.slotOne === "Unavailable" ? undefined : handleContextmenu} data-slot="slotOne">
        {props.slotOne}
      </p>
      <p id="slotTwo" className={switchClass(props.slotTwo, true)} onContextMenu={props.slotOne === "Closed" || props.slotOne === "Unavailable" ? undefined : handleContextmenu} data-slot="slotTwo">
        {props.slotTwo}
      </p>
      <p id="slotThree" className={switchClass(props.slotThree)} onContextMenu={props.slotOne === "Closed" || props.slotOne === "Unavailable" ? undefined : handleContextmenu} data-slot="slotThree">
        {props.slotThree}
      </p>
    </div>
  );
}

function switchClass(text: string, isMiddle: boolean = false) {
  switch (text) {
    case "Closed":
    case "Unavailable":
      return "bg-gray-400";
    case "Available":
      return isMiddle ? "cursor-pointer bg-slate-100 hover:bg-slate-300" : "cursor-pointer hover:bg-slate-300";
    default:
      return isMiddle ? "font-bold underline cursor-pointer bg-slate-100 hover:bg-slate-300" : "font-bold underline cursor-pointer hover:bg-slate-300";
  }
}

export default UserGymCalendarDay;
