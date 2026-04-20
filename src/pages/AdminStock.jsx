import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

// PRODUCT LIST
const PRODUCT_LIST = [
  "ULL - 1",
  "ULL - 2",
  "MISHALI ( KALO )",
  "BLAZER",
  "COLOUR",
  "COLOR WHITE",
  "D - COMBER",
  "D - SUPER",
  "FOOM LOW",
  "FOOM S",
  "FIBER WHITE",
  "FIBER GREEN",
];

const AdminStock = () => {
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("KG");
  const [quantity, setQuantity] = useState("");
  const [shift, setShift] = useState("Morning");
  const [stocks, setStocks] = useState([]);

  // 🔥 HISTORY STATES
  const [history, setHistory] = useState([]);
  const [view, setView] = useState("stock"); // stock | history

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const stockRef = collection(db, "stocks");
  const historyRef = collection(db, "stockHistory");

  // LOAD STOCK
  const loadStocks = async () => {
    const data = await getDocs(stockRef);
    setStocks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // LOAD HISTORY
  const loadHistory = async () => {
    const data = await getDocs(historyRef);
    setHistory(data.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    loadStocks();
    loadHistory();
  }, []);

  // ADD STOCK + HISTORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !quantity) {
      return alert("সব ফিল্ড পূরণ করো");
    }

    const q = query(stockRef, where("productName", "==", productName));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const existingDoc = snapshot.docs[0];
      const oldQty = existingDoc.data().quantity;

      await updateDoc(doc(db, "stocks", existingDoc.id), {
        quantity: oldQty + Number(quantity),
      });
    } else {
      await addDoc(stockRef, {
        productName,
        unit,
        quantity: Number(quantity),
      });
    }

    await addDoc(historyRef, {
      productName,
      quantity: Number(quantity),
      shift,
      date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD format
      createdAt: serverTimestamp(),
    });

    setProductName("");
    setQuantity("");
    setUnit("KG");

    loadStocks();
    loadHistory();
  };

  // 🔥 FILTER LOGIC
  const filteredHistory = history.filter((item) => {
    if (!fromDate && !toDate) return true;

    const itemDate = item.date;

    if (fromDate && !toDate) {
      return itemDate >= fromDate;
    }

    if (!fromDate && toDate) {
      return itemDate <= toDate;
    }

    return itemDate >= fromDate && itemDate <= toDate;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">📦 Stock Management</h1>

      {/* BUTTONS */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setView("stock")}
          className={`px-4 py-2 border ${
            view === "stock" ? "bg-green-600 text-white" : ""
          }`}
        >
          Stock
        </button>

        <button
          onClick={() => setView("history")}
          className={`px-4 py-2 border ${
            view === "history" ? "bg-blue-600 text-white" : ""
          }`}
        >
          History
        </button>
      </div>

      {/* ================= STOCK VIEW ================= */}
      {view === "stock" && (
        <>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4 mb-6">

            <select
              className="border p-2"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            >
              <option value="">Select Product</option>
              {PRODUCT_LIST.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>

            <select
              className="border p-2"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="KG">KG</option>
              <option value="Bale">Bale</option>
            </select>

            <input
              type="number"
              className="border p-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <select
              className="border p-2"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>

            <button className="bg-green-600 text-white">
              Add Stock
            </button>
          </form>

          {/* STOCK TABLE */}
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th>Product</th>
                <th>Unit</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s, i) => (
                <tr key={i} className="text-center border-t">
                  <td>{s.productName}</td>
                  <td>{s.unit}</td>
                  <td>{s.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= HISTORY VIEW ================= */}
      {view === "history" && (
        <>
          <h2 className="text-xl font-bold mb-3">📊 Stock History</h2>

          {/* FILTER */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              className="border p-2"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <input
              type="date"
              className="border p-2"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Shift</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.map((h, i) => (
                <tr key={i} className="text-center border-t">
                  <td>{h.date}</td>
                  <td>{h.productName}</td>
                  <td>{h.shift}</td>
                  <td>{h.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

    </div>
  );
};

export default AdminStock;