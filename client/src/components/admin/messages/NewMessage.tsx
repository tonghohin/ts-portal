import React, { useRef, useState } from "react";
import { MessagesFromMongo } from "../../../pages/admin/Messages";

interface Props {
  readonly newMessage: MessagesFromMongo;
  readonly handleToggleRerender: () => void;
}
interface Form {
  readonly reply: string;
}

function NewMessage(props: Props) {
  const [formData, setFormData] = useState<Form>({ reply: "" });
  const [isFormShown, setIsFormShown] = useState<boolean>(false);
  const Div = useRef<HTMLDivElement>(null);

  function handleClick(): void {
    setIsFormShown(true);
  }

  function handleChange(e: React.FormEvent<HTMLTextAreaElement>): void {
    setFormData({ reply: e.currentTarget.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      if (Div.current) {
        await fetch(`/message/${Div.current.dataset.id}`, { method: "PUT", body: JSON.stringify(formData), headers: { "Content-Type": "application/json" } });
        props.handleToggleRerender();
        setFormData({ reply: "" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div data-id={props.newMessage._id} className="grid grid-cols-2 gap-1 mt-2" ref={Div}>
      <article className="bg-slate-100 rounded p-2 flex flex-col">
        <h1 className="font-bold col-span-full flex justify-between items-center">
          {props.newMessage.name} from unit {props.newMessage.unit}
          <time className="font-normal text-xs">{props.newMessage.createdAt}</time>
        </h1>
        <h2 className="font-semibold">{props.newMessage.subject}</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{props.newMessage.message}</p>
      </article>
      <article className="bg-slate-100 rounded p-2 grid">
        {isFormShown ? (
          <form className="flex flex-col h-72 p-2 text-md bg-white mt-2 border-2 border-green-700 rounded" onSubmit={handleSubmit}>
            <textarea className="resize-none bg-gray-100 m-1 ml-0 border-2 w-full h-full" name="reply" placeholder="Reply" value={formData.reply} onChange={handleChange} required={true} autoComplete="false" />
            <button className="self-start block bg-green-600 text-white py-0.5 px-3 rounded mt-2 hover:bg-cyan-700 transition">Send</button>
          </form>
        ) : (
          <button className="bg-green-600 text-white py-0.5 px-3 rounded place-self-center hover:bg-green-700 transition" onClick={handleClick}>
            Reply
          </button>
        )}
      </article>
    </div>
  );
}

export default NewMessage;
