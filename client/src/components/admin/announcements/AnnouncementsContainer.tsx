import { useState, useEffect } from "react";
import Announcement from "./Announcement";

interface Props {
  readonly toggleRerender: boolean;
  readonly handleToggleRerender: () => void;
}
export interface Announcements {
  readonly _id: string;
  readonly subject: string;
  readonly announcement: string;
  createdAt: string;
  updatedAt: string;
  readonly __v: number;
}

function AnnouncementsContainer(props: Props) {
  const [pastAnnouncements, setPastAnnouncements] = useState<Announcements[]>([]);
  const [isPastAnnouncementsShown, setIsPastAnnouncementsShown] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("/announcement")
      .then((res: Response) => res.json())
      .then((data: Announcements[]) => {
        data.map((obj: Announcements) => (obj.createdAt = new Date(obj.createdAt).toDateString()));
        setPastAnnouncements(data.reverse());
      })
      .catch((err) => console.log(err));
  }, [props.toggleRerender]);

  function handleClick(): void {
    setIsPastAnnouncementsShown(true);
    props.handleToggleRerender();
  }

  return (
    <>
      <button className="block bg-cyan-700 text-white py-0.5 px-3 rounded mt-2 hover:bg-cyan-800 transition" onClick={handleClick}>
        See past announcements
      </button>
      {isPastAnnouncementsShown && (
        <section className="flex flex-col gap-1 p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded">
          <h1 className="text-slate-800 underline">Past Announcements</h1>
          <p className="text-cyan-600">{message}</p>
          {pastAnnouncements.map((announcement) => (
            <Announcement key={announcement._id} announcement={announcement} handleToggleRerender={props.handleToggleRerender} setMessage={setMessage} />
          ))}
        </section>
      )}
    </>
  );
}

export default AnnouncementsContainer;
