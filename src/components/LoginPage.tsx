import { ChangeEvent, useEffect, useState } from "react";
import { UserEmailLogin } from "@/types/AuthTypes";

export default function LoginPage() {
  const [formState, setFormState] = useState<UserEmailLogin>({
    email: "",
    password: "",
  });

  function handleSubmit() {}

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({ ...prevFormState, [name]: value }));
  };

  useEffect(() => {
    console.log("formstate:", formState);
  }, [formState]);

  return (
    <div className="flex flex-col items-center border w-full max-w-md p-3 rounded-md bg-white text-black">
      <h2>Login</h2>
      <form>
        <div className="flex flex-col">
          <label htmlFor="email" className="mr-2">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="text"
            required
            value={formState.email}
            onChange={handleChange}
            className="border border-black rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mr-2">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="text"
            required
            value={formState.password}
            onChange={handleChange}
            className="border border-black rounded-md"
          />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
}
