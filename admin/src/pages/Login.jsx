import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";

const Login = () => {
  const [state, setState] = useState("Admin"); // "Admin" or "Doctor"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl: adminBackendUrl } = useContext(AdminContext);
  const { setDToken, backendUrl: docBackendUrl } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${adminBackendUrl}/api/admin/login`, { email, password });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Logged in successfully as Admin");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${docBackendUrl}/api/doctor/login`, { email, password });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Logged in successfully as Doctor");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-gray-800">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="w-full mt-2">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2.5 mt-1 outline-primary"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2.5 mt-1 outline-primary"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button type="submit" className="bg-primary text-white w-full py-2.5 rounded-md text-base mt-2 hover:bg-blue-600 transition-colors">
          Login
        </button>

        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span onClick={() => setState("Doctor")} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span onClick={() => setState("Admin")} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
