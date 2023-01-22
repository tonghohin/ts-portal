import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";

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

function UserMessages(props: { toggleRerender: boolean }) {
  const userReducer = useAppSelector((store) => store.user);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch(`/message/${userReducer.unit}`)
      .then((res: Response) => res.json())
      .then((data: Message[]) => {
        data.forEach((obj: Message) => {
          obj.updatedAt = new Date(obj.updatedAt).toDateString();
          obj.createdAt = new Date(obj.createdAt).toDateString();
        });
        setMessages(data);
      })
      .catch((err) => console.log(err));
  }, [props.toggleRerender, userReducer.unit]);

  return (
    <section className="p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded">
      <h1 className="text-slate-800 font-bold col-span-full">Past Messages</h1>
      {messages.length !== 0 ? (
        messages.map((messageObj) => {
          return (
            <div key={messageObj._id} className="grid grid-cols-2 gap-1 mt-2">
              <article className="bg-slate-300 rounded p-2 grid grid-cols-2">
                <h1 className="font-bold">{messageObj.subject}</h1>
                <time className="text-xs text-right leading-5">{messageObj.createdAt}</time>
                <p className="text-gray-600 whitespace-pre-wrap">{messageObj.message}</p>
              </article>
              <article className="bg-slate-100 rounded p-2">
                {messageObj.reply ? (
                  <>
                    <time className="text-xs text-right block">Replied on {messageObj.updatedAt}</time>
                    <p className="text-gray-600 whitespace-pre-wrap">{messageObj.reply}</p>
                  </>
                ) : (
                  <p className="font-semibold text-cyan-700">We'll get back to you asap!</p>
                )}
              </article>
            </div>
          );
        })
      ) : (
        <p>No past messages.</p>
      )}
    </section>
  );
}

export default UserMessages;
