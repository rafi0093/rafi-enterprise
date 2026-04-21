import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    dailySalary: "",
  });

  const [editId, setEditId] = useState(null);

  // 📥 Load Employees
  const fetchEmployees = async () => {
    const snapshot = await getDocs(collection(db, "employees"));
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setEmployees(list);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✍️ Handle Input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ➕ Add Employee
  const handleAdd = async () => {
    if (!form.name || !form.dailySalary) return alert("Fill required fields");

    await addDoc(collection(db, "employees"), {
      name: form.name,
      phone: form.phone,
      role: form.role,
      dailySalary: Number(form.dailySalary),
    });

    setForm({ name: "", phone: "", role: "", dailySalary: "" });
    fetchEmployees();
  };

  // ❌ Delete Employee
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "employees", id));
    fetchEmployees();
  };

  // ✏️ Start Edit
  const handleEdit = (emp) => {
    setForm(emp);
    setEditId(emp.id);
  };

  // 💾 Update Employee
  const handleUpdate = async () => {
    if (!editId) return;

    await updateDoc(doc(db, "employees", editId), {
      name: form.name,
      phone: form.phone,
      role: form.role,
      dailySalary: Number(form.dailySalary),
    });

    setEditId(null);
    setForm({ name: "", phone: "", role: "", dailySalary: "" });
    fetchEmployees();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* 🟢 FORM */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-bold mb-3">
          👨‍💼 Employee Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 rounded"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 rounded"
          />

          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role"
            className="border p-2 rounded"
          />

          <input
            name="dailySalary"
            value={form.dailySalary}
            onChange={handleChange}
            placeholder="Daily Salary"
            type="number"
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={editId ? handleUpdate : handleAdd}
          className={`mt-4 px-4 py-2 text-white rounded ${
            editId ? "bg-blue-600" : "bg-green-600"
          }`}
        >
          {editId ? "Update Employee" : "Add Employee"}
        </button>
      </div>

      {/* 🟡 LIST */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-bold mb-3">
          📋 Employee List
        </h3>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Daily Salary</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="text-center border">
                <td>{emp.name}</td>
                <td>{emp.phone}</td>
                <td>{emp.role}</td>
                <td>{emp.dailySalary}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;