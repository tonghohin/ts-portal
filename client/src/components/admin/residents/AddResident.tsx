import { useState } from "react";

interface Props {
  readonly setToggleRerender: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Form {
  readonly firstName: string;
  readonly lastName: string;
  readonly unit: string;
  readonly password: string;
}

function AddResident(props: Props) {
  const [formData, setFormData] = useState<Form>({ firstName: "", lastName: "", unit: "", password: "" });
  const [message, setMessage] = useState<string>("");

  function handleChange(e: React.FormEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      const res: Response = await fetch("/admin/resident", { method: "POST", body: JSON.stringify(formData), headers: { "Content-Type": "application/json" } });
      const data: string = await res.text();
      setMessage(data);
      props.setToggleRerender((prevToggleRerender) => !prevToggleRerender);
      setFormData({ firstName: "", lastName: "", unit: "", password: "" });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form className="p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded" onSubmit={handleSubmit}>
      <h2 className="font-semibold">Add a resident</h2>
      <input className="bg-gray-100 m-1 ml-0 border-2 w-full" type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} required={true} autoComplete="false"></input>
      <input className="bg-gray-100 m-1 ml-0 border-2 w-full" type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} required={true} autoComplete="false"></input>
      <input className="bg-gray-100 m-1 ml-0 border-2 w-full" type="text" name="unit" placeholder="Unit" onChange={handleChange} value={formData.unit} required={true} autoComplete="false"></input>
      <input className="bg-gray-100 m-1 ml-0 border-2 w-full" type="text" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required={true} autoComplete="false"></input>
      <button className="block bg-cyan-600 text-white py-0.5 px-3 rounded mt-2 hover:bg-cyan-700 transition">Add</button>
      <p className="text-cyan-600">{message}</p>
    </form>
  );
}

export default AddResident;
