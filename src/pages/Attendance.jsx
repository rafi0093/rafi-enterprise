import React, { useState } from "react";

const AttendanceSheet = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [salary, setSalary] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(null);

  // নতুন কর্মচারী যোগ করার ফাংশন
  const addEmployee = (name, id) => {
    setEmployees([...employees, { name, id }]);
    setAttendance({ ...attendance, [id]: {} });
    setSalary({ ...salary, [id]: 0 });
  };

  // কর্মচারী রিমুভ করার ফাংশন
  const removeEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    const newAttendance = { ...attendance };
    delete newAttendance[id];
    setAttendance(newAttendance);
    const newSalary = { ...salary };
    delete newSalary[id];
    setSalary(newSalary);
  };

  // উপস্থিতি সেট করার ফাংশন
  const markAttendance = (id, date, present) => {
    setAttendance({
      ...attendance,
      [id]: {
        ...attendance[id],
        [date]: present,
      },
    });
  };

  // সেলারি জেনারেট করার ফাংশন
  const generateSalary = (weekStartDate) => {
    const newSalary = { ...salary };
    employees.forEach(emp => {
      const weekAttendance = Object.keys(attendance[emp.id] || {}).filter(date => 
        new Date(date) >= new Date(weekStartDate) && 
        new Date(date) <= new Date(new Date(weekStartDate).setDate(new Date(weekStartDate).getDate() + 6))
      );
      newSalary[emp.id] = weekAttendance.length * 100; // ধরো, প্রতিদিন 100 টাকা
    });
    setSalary(newSalary);
  };

  return (
    <div>
      <h2>Attendance Sheet</h2>
      <div>
        {/* কর্মচারী যোগ করার জন্য ফর্ম */}
        <input type="text" placeholder="Employee Name" id="empName" />
        <input type="text" placeholder="Employee ID" id="empID" />
        <button onClick={() => {
          const name = document.getElementById('empName').value;
          const id = document.getElementById('empID').value;
          addEmployee(name, id);
        }}>Add Employee</button>
      </div>

      {/* কর্মচারীদের তালিকা এবং উপস্থিতি সেট করার ফর্ম */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            Object.keys(attendance[emp.id] || {}).map(date => (
              <tr key={`${emp.id}-${date}`}>
                <td>{emp.name}</td>
                <td>{date}</td>
                <td>
                  <input type="checkbox" 
                    checked={attendance[emp.id][date] || false}
                    onChange={(e) => markAttendance(emp.id, date, e.target.checked)} 
                  />
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>

      {/* সেলারি জেনারেট বাটন */}
      <div>
        <input type="date" onChange={(e) => setSelectedWeek(e.target.value)} />
        <button onClick={() => generateSalary(selectedWeek)}>Generate Salary</button>
      </div>

      {/* সেলারির টেবিল */}
      <h3>Salary Sheet</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{salary[emp.id] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceSheet;