import { useEffect, useState } from "react";
import NewMessage from "../../components/admin/messages/NewMessage";
import PastMessage from "../../components/admin/messages/PastMessage";

export interface MessagesFromMongo {
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
interface Messages {
  readonly newMessage: MessagesFromMongo[];
  readonly pastMessage: MessagesFromMongo[];
}

function Messages() {
  const [messages, setMessages] = useState<Messages>({ newMessage: [], pastMessage: [] });
  const [toggleRerender, setToggleRerender] = useState<boolean>(false);

  function handleToggleRerender(): void {
    setToggleRerender((prevToggleRerender) => !prevToggleRerender);
  }

  useEffect(() => {
    fetch("/message")
      .then((res: Response) => res.json())
      .then((data: MessagesFromMongo[]) => {
        data.forEach((obj: MessagesFromMongo) => {
          obj.updatedAt = new Date(obj.updatedAt).toDateString();
          obj.createdAt = new Date(obj.createdAt).toDateString();
        });
        setMessages({ newMessage: data.filter((obj: MessagesFromMongo) => !obj.reply), pastMessage: data.filter((obj: MessagesFromMongo) => obj.reply) });
      })
      .catch((err) => console.log(err));
  }, [toggleRerender]);

  return (
    <main className="p-5 bg-gray-100 overflow-auto">
      <h1 className="text-xl font-semibold">Messages</h1>
      <section className="p-2 text-md bg-white mt-2 border-2 border-green-600 rounded">
        <h1 className="text-slate-800 font-bold col-span-full">New Message</h1>
        {messages.newMessage.length !== 0 ? messages.newMessage.map((newMessageObj) => <NewMessage key={newMessageObj._id} newMessage={newMessageObj} handleToggleRerender={handleToggleRerender} />) : <p>No new messages.</p>}
      </section>
      <section className="p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded">
        <h1 className="text-slate-800 font-bold col-span-full">Past Message</h1>
        {messages.pastMessage.map((pastMessageObj) => (
          <PastMessage key={pastMessageObj._id} pastMessage={pastMessageObj} handleToggleRerender={handleToggleRerender} />
        ))}
      </section>
    </main>
  );
}

export default Messages;
