import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [history, setHistory] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(null);

  const daysName = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  // 📅 generate week
  const getWeekDays = (start) => {
    if (!start) return [];
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }

    return days;
  };

  const weekDays = getWeekDays(startDate);

  // 👨‍💼 employees
  const fetchEmployees = async () => {
    const snap = await getDocs(collection(db, "employees"));
    setEmployees(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  // 📅 attendance
  const fetchAttendance = async () => {
    const snap = await getDocs(collection(db, "attendance"));

    let map = {};

    snap.forEach(docSnap => {
      const date = docSnap.id;
      if (!weekDays.includes(date)) return;

      const data = docSnap.data();

      Object.keys(data).forEach(empId => {
        if (!map[empId]) map[empId] = {};

        const status =
          typeof data[empId] === "string"
            ? data[empId]
            : data[empId]?.status;

        map[empId][date] = status || "absent";
      });
    });

    setAttendanceData(map);
  };

  // 📚 history
  const fetchHistory = async () => {
    const snap = await getDocs(collection(db, "salaryHistory"));
    setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchEmployees();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (startDate) fetchAttendance();
  }, [startDate]);

  // 💰 calculate
  const calculate = (emp) => {
    let present = 0;
    let days = [];

    weekDays.forEach(day => {
      const status = attendanceData[emp.id]?.[day] || "absent";
      days.push(status);
      if (status === "present") present++;
    });

    return {
      present,
      salary: present * Number(emp.dailySalary || 0),
      days,
    };
  };

  // 💾 pay + save history
  const handlePay = async (emp) => {
    const result = calculate(emp);

    const weekId = `${weekDays[0]}_${weekDays[6]}`;

    const newRow = {
      name: emp.name,
      days: result.days,
      totalPresent: result.present,
      salary: result.salary,
      paid: true,
      paidAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "salaryHistory", weekId), {
      from: weekDays[0],
      to: weekDays[6],
      data: {
        ...(history.find(h => h.id === weekId)?.data || {}),
        [emp.id]: newRow,
      },
    });

    alert("💰 Paid Successfully!");
    fetchHistory();
  };

  // 🔍 filter history
  const filteredHistory = history.filter(h => {
    if (!filterDate) return true;
    return h.from === filterDate || h.to === filterDate;
  });

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        💰 Salary Sheet
      </h1>

      {/* week select */}
      <input
        type="date"
        className="border p-2 mb-3"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-center bg-white">

          <thead>
            <tr className="bg-gray-200">
              <th>Name</th>
              {daysName.map((d,i) => (
                <th key={i}>{d}</th>
              ))}
              <th>Total</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map(emp => {
              const result = calculate(emp);

              const weekId = `${weekDays[0]}_${weekDays[6]}`;
              const paidData = history.find(h => h.id === weekId);
              const isPaid = paidData?.data?.[emp.id]?.paid || false;

              return (
                <tr key={emp.id} className="border">

                  <td>{emp.name}</td>

                  {result.days.map((d,i) => (
                    <td
                      key={i}
                      className={d === "present" ? "text-green-600" : "text-red-500"}
                    >
                      {d === "present" ? "P" : "A"}
                    </td>
                  ))}

                  <td>{result.present}</td>

                  <td className="font-bold text-green-600">
                    ৳ {result.salary}
                  </td>

                  <td>
                    <button
                      onClick={() => !isPaid && handlePay(emp)}
                      className={`px-3 py-1 rounded text-white ${
                        isPaid ? "bg-blue-500" : "bg-red-500"
                      }`}
                    >
                      {isPaid ? "PAID" : "PAY"}
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* 🔍 HISTORY SEARCH */}
      <h2 className="text-xl font-bold mt-8">
        📚 Salary History
      </h2>

      <div className="flex gap-2 mb-3 mt-2">

        <input
          type="date"
          className="border p-2"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        <button
          onClick={() => setFilterDate("")}
          className="bg-gray-500 text-white px-3 rounded"
        >
          Reset
        </button>

      </div>

      {/* HISTORY LIST (CLICKABLE) */}
      {filteredHistory.length === 0 ? (
        <p>No history found</p>
      ) : (
        filteredHistory.map(h => (
          <div
            key={h.id}
            className="bg-gray-100 p-3 mt-3 rounded cursor-pointer hover:bg-gray-200"
            onClick={() => setSelectedHistory(h)}
          >

            <p className="font-bold">
              📅 {h.from} → {h.to}
            </p>

            <p className="text-sm text-gray-600">
              Click to open full salary sheet
            </p>

          </div>
        ))
      )}

      {/* MODAL VIEW */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-white p-4 w-[95%] max-h-[90vh] overflow-auto rounded">

            <div className="flex justify-between mb-3">
              <h2 className="font-bold">
                📚 Salary Sheet ({selectedHistory.from} → {selectedHistory.to})
              </h2>

              <button
                onClick={() => setSelectedHistory(null)}
                className="text-red-500 font-bold"
              >
                ✖ Close
              </button>
            </div>

            <table className="w-full border text-center">

              <thead>
                <tr className="bg-gray-200">
                  <th>Name</th>
                  {daysName.map((d,i) => (
                    <th key={i}>{d}</th>
                  ))}
                  <th>Total</th>
                  <th>Salary</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(selectedHistory.data || {}).map(([id, emp]) => (
                  <tr key={id} className="border">

                    <td>{emp.name}</td>

                    {emp.days?.map((d,i) => (
                      <td key={i} className={d === "present" ? "text-green-600" : "text-red-500"}>
                        {d === "present" ? "P" : "A"}
                      </td>
                    ))}

                    <td>{emp.totalPresent}</td>

                    <td className="text-green-600 font-bold">
                      ৳ {emp.salary}
                    </td>

                    <td className={emp.paid ? "text-blue-600 font-bold" : "text-red-600"}>
                      {emp.paid ? "PAID" : "UNPAID"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
};

export default Salary;