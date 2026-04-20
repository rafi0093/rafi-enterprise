import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const StockHistory = () => {
  const [history, setHistory] = useState([]);

  // FILTER STATES
  const [date, setDate] = useState("");
  const [product, setProduct] = useState("");
  const [shift, setShift] = useState("");

  const historyRef = collection(db, "stockHistory");

  // LOAD ALL HISTORY
  const loadHistory = async () => {
    const data = await getDocs(historyRef);
    setHistory(data.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // FILTER LOGIC
  const filteredData = history.filter((item) => {
    return (
      (date === "" || item.date === date) &&
      (product === "" || item.productName === product) &&
      (shift === "" || item.shift === shift)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">📊 Stock History Report</h1>

      {/* FILTER SECTION */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <input
          type="date"
          className="border p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Product Name"
          className="border p-2"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <select
          className="border p-2"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        >
          <option value="">All Shift</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>

      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Product</th>
            <th className="p-2">Shift</th>
            <th className="p-2">Quantity</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className="text-center border-t">
              <td>{item.date}</td>
              <td>{item.productName}</td>
              <td>{item.shift}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default StockHistory;