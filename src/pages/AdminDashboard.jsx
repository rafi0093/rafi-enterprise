import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // 🔥 Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* MEMO */}
        <div
          onClick={() => navigate("/admin/memo")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <h2 className="text-lg font-semibold">🧾 Memo</h2>
          <p className="text-sm text-gray-600 mt-2">
            Create and print memos
          </p>
        </div>

        {/* STOCK */}
        <div
          onClick={() => navigate("/admin/stock")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <h2 className="text-lg font-semibold">📦 Stock</h2>
          <p className="text-sm text-gray-600 mt-2">
            Manage stock items
          </p>
        </div>

        {/* EMPLOYEE ATTENDANCE */}
        <div
          onClick={() => navigate("/admin/attendance")} // ✅ FIXED
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <h2 className="text-lg font-semibold">👨‍💼 Attendance</h2>
          <p className="text-sm text-gray-600 mt-2">
            Track employee attendance
          </p>
        </div>

        {/* TALLY KHATA */}
        <div
          onClick={() => navigate("/admin/tally")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <h2 className="text-lg font-semibold">📒 Tally Khata</h2>
          <p className="text-sm text-gray-600 mt-2">
            Manage daily accounts
          </p>
        </div>

        {/* OLD INVOICE / MEMO */}
        <div
          onClick={() => navigate("/admin/invoices")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <h2 className="text-lg font-semibold">🧾 Old Invoices</h2>
          <p className="text-sm text-gray-600 mt-2">
            View all saved memos & invoices
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;