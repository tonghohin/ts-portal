import UserGymCalendarDay from "./UserGymCalendarDay";
import { GymSchedule, ContextmenuInfo, Timeslot } from "../../../pages/user/UserGym";

interface Props {
  readonly date: string;
  readonly day: GymSchedule;
  readonly setContextmenuInfo: React.Dispatch<React.SetStateAction<ContextmenuInfo>>;
  readonly setClickedTimslot: React.Dispatch<React.SetStateAction<Timeslot>>;
}

function UserGymCalendar(props: Props) {
  return (
    <article className="text-center border">
      <h1 className="font-semibold border-b border-gray-400 py-2">{props.date}</h1>
      {props.day.timeslot.map((timeslotObj) => (
        <UserGymCalendarDay key={timeslotObj._id} dayId={props.day._id} time={timeslotObj.time} slotOne={timeslotObj.slotOne} slotTwo={timeslotObj.slotTwo} slotThree={timeslotObj.slotThree} setClickedTimslot={props.setClickedTimslot} setContextmenuInfo={props.setContextmenuInfo} />
      ))}
    </article>
  );
}

export default UserGymCalendar;
