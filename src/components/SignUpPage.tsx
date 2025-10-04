import { ChangeEvent, useState } from "react";
import { UserEmailLogin } from "@/types/AuthTypes";

export default function SignUpPage() {
  const [formState, setFormState] = useState<UserEmailLogin>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const signUpRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const payload = await signUpRes.json();
      console.log("payload: ", payload);
    } catch (error) {
      console.error("Error creating new user: ", error);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({ ...prevFormState, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center border w-full max-w-md p-3 rounded-md bg-white text-black">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="email" className="mr-2">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="text"
            required
            value={formState?.email}
            onChange={onChange}
            className="border border-black rounded-md p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mr-2">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formState?.password}
            onChange={onChange}
            required
            className="border border-black rounded-md p-1"
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
