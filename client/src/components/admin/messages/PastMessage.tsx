import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { MessagesFromMongo } from "../../../pages/admin/Messages";

interface Props {
  readonly pastMessage: MessagesFromMongo;
  readonly handleToggleRerender: () => void;
}
interface ClickedMessage {
  readonly coor: { x: number; y: number };
  readonly id: string;
  readonly reply: string;
  readonly isInEditMode: boolean;
}

function PastMessage(props: Props) {
  const [contextmenuIsShown, setContextmenuIsShown] = useState<boolean>(false);
  const [clickedMessage, setClickedMessage] = useState<ClickedMessage>({ coor: { x: 0, y: 0 }, id: "", reply: "", isInEditMode: false });
  const Div = useRef<HTMLDivElement>(null);
  const P = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    window.addEventListener("click", () => {
      setContextmenuIsShown(false);
    });
  }, []);

  function handleContextmenu(e: React.MouseEvent<HTMLElement>): void {
    e.preventDefault();
    setContextmenuIsShown(true);
    if (Div.current && Div.current.dataset.id && P.current && P.current.textContent) {
      setClickedMessage({ coor: { x: e.clientX, y: e.clientY }, id: Div.current.dataset.id, reply: P.current.textContent, isInEditMode: false });
    }
  }

  function handleChange(e: React.FormEvent<HTMLTextAreaElement>): void {
    setClickedMessage({ ...clickedMessage, reply: e.currentTarget.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      await fetch(`/message/${clickedMessage.id}`, { method: "PUT", body: JSON.stringify({ reply: clickedMessage.reply }), headers: { "Content-Type": "application/json" } });
      setClickedMessage({ coor: { x: 0, y: 0 }, id: "", reply: "", isInEditMode: false });
      props.handleToggleRerender();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div key={props.pastMessage._id} data-id={props.pastMessage._id} className="grid grid-cols-2 gap-1 mt-2" ref={Div}>
      <article className="bg-slate-300 rounded p-2 flex flex-col ">
        <h1 className="font-bold col-span-full flex justify-between items-center">
          {props.pastMessage.name} from unit {props.pastMessage.unit}
          <time className="font-normal text-xs">{props.pastMessage.createdAt}</time>
        </h1>
        <h2 className="font-semibold">{props.pastMessage.subject}</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{props.pastMessage.message}</p>
      </article>

      {clickedMessage.isInEditMode ? (
        <form className="flex flex-col h-72 p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded" onSubmit={handleSubmit}>
          <textarea className="resize-none bg-gray-100 m-1 ml-0 border-2 w-full h-full" name="reply" placeholder="Reply" value={clickedMessage.reply} onChange={handleChange} required={true} autoComplete="false" />
          <button className="self-start block bg-cyan-600 text-white py-0.5 px-3 rounded mt-2 hover:bg-cyan-700 transition">Edit</button>
        </form>
      ) : (
        <article className="bg-slate-100 rounded p-2 cursor-pointer hover:bg-slate-200" onContextMenu={handleContextmenu}>
          <time className="text-xs text-right block">Replied on {props.pastMessage.updatedAt}</time>
          <p className="text-gray-600 whitespace-pre-wrap" ref={P}>
            {props.pastMessage.reply}
          </p>
          {contextmenuIsShown && <Contextmenu clickedMessage={clickedMessage} setClickedMessage={setClickedMessage} />}
        </article>
      )}
    </div>
  );
}

interface ContextmenuProps {
  clickedMessage: ClickedMessage;
  setClickedMessage: React.Dispatch<React.SetStateAction<ClickedMessage>>;
}

function Contextmenu(props: ContextmenuProps) {
  function handleClick(): void {
    props.setClickedMessage({ ...props.clickedMessage, isInEditMode: true });
  }
  return (
    <button className="bg-white border border-slate-500 px-1 rounded fixed hover:bg-slate-300" style={{ left: props.clickedMessage.coor.x, top: props.clickedMessage.coor.y }} onClick={handleClick}>
      Edit
      <PencilSquareIcon className="h-5 w-5 inline ml-2 mb-1 text-green-600" />
    </button>
  );
}

export default PastMessage;
