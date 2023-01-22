import { PencilSquareIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Announcements } from "./AnnouncementsContainer";
import { useRef } from "react";

interface Props {
  readonly announcement: Announcements;
  readonly handleToggleRerender: () => void;
  readonly setMessage: React.Dispatch<React.SetStateAction<string>>;
}
interface ClickedAnnouncement {
  readonly coor: { x: number; y: number };
  readonly id: string;
  readonly subject: string;
  readonly announcement: string;
  readonly isInEditMode: boolean;
}

function Announcement(props: Props) {
  const [contextmenuIsShown, setContextmenuIsShown] = useState<boolean>(false);
  const [clickedAnnouncement, setClickedAnnouncement] = useState<ClickedAnnouncement>({ coor: { x: 0, y: 0 }, id: "", subject: "", announcement: "", isInEditMode: false });
  const H1 = useRef<HTMLHeadingElement>(null);
  const P = useRef<HTMLParagraphElement>(null);

  function handleContextmenu(e: React.MouseEvent<HTMLElement>): void {
    e.preventDefault();
    setContextmenuIsShown(true);
    if (H1.current && H1.current.textContent && P.current && P.current.textContent) {
      setClickedAnnouncement({ coor: { x: e.clientX, y: e.clientY }, id: e.currentTarget.id, subject: H1.current.textContent, announcement: P.current.textContent, isInEditMode: false });
    }
  }

  useEffect(() => {
    window.addEventListener("click", () => {
      setContextmenuIsShown(false);
    });
  }, []);

  function handleChange(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setClickedAnnouncement({ ...clickedAnnouncement, [e.currentTarget.name]: e.currentTarget.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res: Response = await fetch(`/announcement/${clickedAnnouncement.id}`, { method: "PUT", body: JSON.stringify({ subject: clickedAnnouncement.subject, announcement: clickedAnnouncement.announcement }), headers: { "Content-Type": "application/json" } });
      const data: string = await res.text();
      props.setMessage(data);
      setClickedAnnouncement({ coor: { x: 0, y: 0 }, id: "", subject: "", announcement: "", isInEditMode: false });
      props.handleToggleRerender();
    } catch (err) {
      console.log(err);
    }
  }

  return clickedAnnouncement.isInEditMode ? (
    <form className="flex flex-col h-72 p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded" onSubmit={handleSubmit}>
      <input className="bg-gray-100 m-1 ml-0 border-2 w-full" type="text" name="subject" placeholder="Subject" onChange={handleChange} value={clickedAnnouncement.subject} required={true} autoComplete="false"></input>
      <textarea className="resize-none bg-gray-100 m-1 ml-0 border-2 w-full h-full" name="announcement" placeholder="Announcement" value={clickedAnnouncement.announcement} onChange={handleChange} required={true} autoComplete="false" />
      <button className="self-start block bg-cyan-600 text-white py-0.5 px-3 rounded mt-2 hover:bg-cyan-700 transition">Edit</button>
    </form>
  ) : (
    <article id={props.announcement._id} className="bg-slate-100 rounded p-2 grid grid-cols-2 cursor-pointer hover:bg-slate-200" onContextMenu={handleContextmenu}>
      <h1 className="font-bold" ref={H1}>
        {props.announcement.subject}
      </h1>
      <time className="text-xs text-right leading-5">{props.announcement.createdAt}</time>
      <p className="text-gray-600 whitespace-pre-wrap" ref={P}>
        {props.announcement.announcement}
      </p>
      {contextmenuIsShown && <Contextmenu setClickedAnnouncement={setClickedAnnouncement} clickedAnnouncement={clickedAnnouncement} />}
    </article>
  );
}

interface ContextmenuProps {
  readonly setClickedAnnouncement: React.Dispatch<React.SetStateAction<ClickedAnnouncement>>;
  readonly clickedAnnouncement: ClickedAnnouncement;
}

function Contextmenu(props: ContextmenuProps) {
  function handleClick(): void {
    props.setClickedAnnouncement({ ...props.clickedAnnouncement, isInEditMode: true });
  }
  return (
    <button className="bg-white border border-slate-500 px-1 rounded fixed hover:bg-slate-300" style={{ left: props.clickedAnnouncement.coor.x, top: props.clickedAnnouncement.coor.y }} onClick={handleClick}>
      Edit
      <PencilSquareIcon className="h-5 w-5 inline ml-2 mb-1 text-green-600" />
    </button>
  );
}

export default Announcement;
