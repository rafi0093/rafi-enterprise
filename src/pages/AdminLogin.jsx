import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow">
        <h2 className="text-xl mb-4">Admin Login</h2>

        <input type="email" placeholder="Email" className="border p-2 mb-3 w-full"
          onChange={(e) => setEmail(e.target.value)} />

        <input type="password" placeholder="Password" className="border p-2 mb-3 w-full"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="bg-green-600 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;