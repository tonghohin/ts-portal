import React, { useState } from "react";
import AnnouncementsContainer from "../../components/admin/announcements/AnnouncementsContainer";

interface Form {
  subject: string;
  announcement: string;
}

function Announcements() {
  const [formData, setFormData] = useState<Form>({ subject: "", announcement: "" });
  const [message, setMessage] = useState<string>("");
  const [toggleRerender, setToggleRerender] = useState<boolean>(false);

  function handleToggleRerender(): void {
    setToggleRerender((prevToggleRerender) => !prevToggleRerender);
  }

  function handleChange(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      const res: Response = await fetch("/announcement", { method: "POST", body: JSON.stringify(formData), headers: { "Content-Type": "application/json" } });
      const data: string = await res.text();
      setMessage(data);
      handleToggleRerender();
      setFormData({ subject: "", announcement: "" });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="p-5 bg-gray-100 overflow-auto">
      <h1 className="text-xl font-semibold">Announcements</h1>
      <form className="flex flex-col h-72 p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded" onSubmit={handleSubmit}>
        <input className="bg-gray-100 m-1 ml-0 border-2 w-full" type="text" name="subject" placeholder="Subject" onChange={handleChange} value={formData.subject} required={true} autoComplete="false"></input>
        <textarea className="resize-none bg-gray-100 m-1 ml-0 border-2 w-full h-full" name="announcement" placeholder="Announcement" value={formData.announcement} onChange={handleChange} required={true} autoComplete="false" />
        <p className="text-cyan-600">{message}</p>
        <button className="self-start block bg-cyan-600 text-white py-0.5 px-3 rounded mt-2 hover:bg-cyan-700 transition">Publish</button>
      </form>
      <AnnouncementsContainer toggleRerender={toggleRerender} handleToggleRerender={handleToggleRerender} />
    </main>
  );
}

export default Announcements;
