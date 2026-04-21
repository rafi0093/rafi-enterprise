import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState({});

  // 👨‍💼 Load Employees
  const fetchEmployees = async () => {
    const snap = await getDocs(collection(db, "employees"));
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(list);
  };

  // 📅 Load Attendance for selected date
  const fetchAttendance = async () => {
    const docRef = doc(db, "attendance", date);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      setAttendance(snap.data());
    } else {
      let empty = {};
      employees.forEach((emp) => {
        empty[emp.id] = { status: "absent" };
      });
      setAttendance(empty);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchAttendance();
    }
  }, [date, employees]);

  // 🔄 Toggle Present/Absent
  const toggleStatus = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: {
        status:
          prev[id]?.status === "present" ? "absent" : "present",
      },
    }));
  };

  // 💾 Save Attendance
  const handleSave = async () => {
    await setDoc(doc(db, "attendance", date), attendance);
    alert("✅ Attendance Saved");
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        📅 Attendance System
      </h1>

      {/* Date Picker */}
      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Employee List */}
      <div className="bg-white shadow rounded p-4">

        {employees.map((emp) => (
          <div
            key={emp.id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <h2 className="font-semibold">{emp.name}</h2>
              <p className="text-sm text-gray-500">{emp.role}</p>
            </div>

            <button
              onClick={() => toggleStatus(emp.id)}
              className={`px-4 py-2 rounded text-white ${
                attendance[emp.id]?.status === "present"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {attendance[emp.id]?.status === "present"
                ? "Present"
                : "Absent"}
            </button>
          </div>
        ))}

      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        💾 Save Attendance
      </button>

    </div>
  );
};

export default Attendance;