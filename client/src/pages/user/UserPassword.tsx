import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";

interface Form {
  unit?: string;
  confirmNewPassword: string;
  newPassword: string;
}

function UserPassport() {
  const userReducer = useAppSelector((store) => store.user);
  const [formData, setFormData] = useState<Form>({ unit: userReducer.unit, confirmNewPassword: "", newPassword: "" });
  const [message, setMessage] = useState<string>("");

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (formData.confirmNewPassword !== "" && formData.newPassword !== "" && formData.confirmNewPassword === formData.newPassword) {
        const res = await fetch(`/resident/${formData.unit}`, { method: "PUT", body: JSON.stringify(formData), headers: { "Content-Type": "application/json" } });
        const data: string = await res.text();
        setMessage(data);
        setFormData({ unit: userReducer.unit, confirmNewPassword: "", newPassword: "" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="p-5 bg-gray-100 overflow-auto">
      <h1 className="text-xl font-semibold">Change your password</h1>
      <form className="flex flex-col max-w-sm p-2 text-md bg-white mt-2 border-2 border-cyan-600 rounded" onSubmit={handleSubmit}>
        <input className="bg-gray-100 m-1 ml-0 border-2 w-full" type="password" name="newPassword" placeholder="New Password" onChange={handleChange} value={formData.newPassword} required={true} autoComplete="false"></input>
        <input className="bg-gray-100 m-1 ml-0 border-2 w-full inline" type="password" name="confirmNewPassword" placeholder="Confirm New Password" onChange={handleChange} value={formData.confirmNewPassword} required={true} autoComplete="false"></input>

        {formData.confirmNewPassword !== "" && formData.newPassword !== "" && formData.confirmNewPassword === formData.newPassword && (
          <p className="text-green-600">
            Passwords matched
            <CheckCircleIcon className="h-5 w-5 inline ml-2 mb-1 text-green-600" />
          </p>
        )}
        {formData.confirmNewPassword !== "" && formData.newPassword !== "" && formData.confirmNewPassword !== formData.newPassword && (
          <p className="text-red-600">
            Passwords not matched
            <XCircleIcon className="h-5 w-5 inline ml-2 mb-1 text-red-600" />
          </p>
        )}

        <p className="text-cyan-600">{message}</p>

        <button className="self-start block bg-cyan-600 text-white py-0.5 px-3 rounded mt-2 hover:bg-cyan-700 transition">Confirm</button>
      </form>
    </main>
  );
}

export default UserPassport;
