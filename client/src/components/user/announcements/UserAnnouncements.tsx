import { useEffect, useState } from "react";

interface Announcements {
  readonly _id: string;
  readonly subject: string;
  readonly announcement: string;
  createdAt: string;
  updatedAt: string;
  readonly __v: number;
}

function UserAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcements[]>([]);

  useEffect(() => {
    fetch("/announcement")
      .then((res: Response) => res.json())
      .then((data: Announcements[]) => {
        console.log(data)
        data.map((obj: Announcements) => (obj.createdAt = new Date(obj.createdAt).toDateString()));
        setAnnouncements(data.reverse());
      });
  }, []);

  return (
    <>
      <section className="flex flex-col gap-1 p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded">
        <h1 className="text-slate-800 font-bold">Announcements</h1>
        {announcements.map((annoucementObj) => {
          return (
            <article key={annoucementObj._id} className="bg-slate-100 rounded p-2 grid grid-cols-2">
              <h1 className="font-bold">{annoucementObj.subject}</h1>
              <time className="text-xs text-right leading-5">{annoucementObj.createdAt}</time>
              <p className="text-gray-600 whitespace-pre-wrap">{annoucementObj.announcement}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}

export default UserAnnouncements;
