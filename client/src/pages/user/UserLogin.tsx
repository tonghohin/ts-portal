import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchUserAuthentication } from "../../features/userSlice";

interface Form {
  unit: string;
  password: string;
}
interface APIRes {
  isInvalidUnitOrPassword?: boolean;
  token?: string;
}

function UserLogin() {
  const [formData, setFormData] = useState<Form>({ unit: "", password: "" });
  const [isInvalidUnitOrPassword, setIsInvalidUnitOrPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  function handleChange(e: React.FormEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      const res: Response = await fetch("/login", { method: "POST", body: JSON.stringify(formData), headers: { "Content-Type": "application/json" } });
      const data: APIRes = await res.json();
      if (data.isInvalidUnitOrPassword) {
        setIsInvalidUnitOrPassword(data.isInvalidUnitOrPassword);
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch(fetchUserAuthentication());
      }
      setFormData({ unit: "", password: "" });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="col-span-full bg-slate-100">
      <h1 className="bg-gray-700 text-gray-100 text-2xl font-bold text-center py-4">Granbury Place</h1>
      <form className="text-center mt-40 bg-slate-300 border-2 rounded border-gray-300 w-72 h-72 m-auto flex flex-col items-center justify-around" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold">Welcome to Granbury Place</h3>
        <input type="text" name="unit" className="rounded bg-slate-100 p-2" placeholder="Unit No." value={formData.unit} onChange={handleChange} autoComplete="false" required={true}></input>
        <input type="password" name="password" className="rounded bg-slate-100 p-2" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete="false" required={true}></input>
        {isInvalidUnitOrPassword && <p className="text-red-600">Invalid unit no./password</p>}
        <button className="bg-slate-500 text-white rounded p-1 w-20 hover:bg-slate-600">Login</button>
      </form>
    </main>
  );
}

export default UserLogin;
