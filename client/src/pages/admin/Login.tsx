import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { fetchAuthentication } from "../../features/adminSlice";

interface Form {
  username: string;
  password: string;
}
interface APIRes {
  isInvalidUsernameOrPassword?: boolean;
  token?: string;
}

function Login() {
  const [formData, setFormData] = useState<Form>({ username: "", password: "" });
  const [isInvalidUsernameOrPassword, setIsInvalidUsernameOrPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      const res: Response = await fetch("/admin/login", { method: "POST", body: JSON.stringify(formData), headers: { "Content-Type": "application/json" } });
      const data: APIRes = await res.json();
      if (data.isInvalidUsernameOrPassword) {
        setIsInvalidUsernameOrPassword(data.isInvalidUsernameOrPassword);
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch(fetchAuthentication());
      }
      setFormData({ username: "", password: "" });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="col-span-full bg-slate-100">
      <h1 className="bg-gray-700 text-gray-100 text-2xl font-bold text-center py-4">Granbury Place</h1>
      <form className="text-center mt-40 bg-slate-300 border-2 rounded border-gray-300 w-72 h-72 m-auto flex flex-col items-center justify-around" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold">Admin Login</h3>
        <input type="text" name="username" className="rounded bg-slate-100 p-2" placeholder="Username" value={formData.username} onChange={handleChange} autoComplete="false" required={true}></input>
        <input type="password" name="password" className="rounded bg-slate-100 p-2" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete="false" required={true}></input>
        {isInvalidUsernameOrPassword && <p className="text-red-600">Invalid username/password</p>}
        <button className="bg-slate-500 text-white rounded p-1 w-20 hover:bg-slate-600">Login</button>
        <Link to="/admin/register" className="underline text-gray-600 hover:text-black">
          Go to Register Page
        </Link>
      </form>
    </main>
  );
}

export default Login;
