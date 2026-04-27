import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

const OldInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [date, setDate] = useState("");
  const [serial, setSerial] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📥 Load all invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInvoices(data);
    } catch (error) {
      console.error(error);
      alert("Error loading invoices");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 🔍 Date search
  const handleDateSearch = async () => {
    if (!date) return alert("Select a date");

    setLoading(true);
    try {
      const q = query(collection(db, "invoices"), where("date", "==", date));

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInvoices(data);
    } catch (error) {
      console.error(error);
      alert("Date search error");
    }
    setLoading(false);
  };

  // 🔎 Serial search
  const handleSerialSearch = async () => {
    if (!serial) return alert("Enter serial");

    setLoading(true);
    try {
      const q = query(
        collection(db, "invoices"),
        where("serial", "==", serial)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Invoice not found");
        setLoading(false);
        return;
      }

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInvoices(data);
    } catch (error) {
      console.error(error);
      alert("Serial search error");
    }
    setLoading(false);
  };

  // 🎨 Table Styles
  const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
    background: "#f3f4f6",
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📄 Old Invoices</h2>

      {/* 🔍 Search Section */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleDateSearch}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Search Date
        </button>

        <input
          type="text"
          placeholder="MEMO-2026-00001"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleSerialSearch}
          className="bg-green-500 text-white px-3 py-2 rounded"
        >
          Search Serial
        </button>

        <button
          onClick={fetchInvoices}
          className="bg-gray-500 text-white px-3 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* ⏳ Loading */}
      {loading && <p>Loading...</p>}

      {/* 📋 Invoice List */}
      <div className="grid md:grid-cols-2 gap-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            onClick={() => setSelectedInvoice(inv)}
            className="border p-3 rounded cursor-pointer hover:bg-gray-100"
          >
            <p className="font-bold">{inv.serial}</p>
            <p>Date: {inv.date}</p>
            <p>Total: {inv.totalAmount} ৳</p>
          </div>
        ))}
      </div>

      {/* ❌ No Data */}
      {!loading && invoices.length === 0 && (
        <p className="mt-4 text-red-500">No invoices found</p>
      )}

      {/* 👁️ Invoice Details */}
      {selectedInvoice && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h3 className="text-lg font-bold mb-2">Invoice Details</h3>

          <p><strong>Serial:</strong> {selectedInvoice.serial}</p>
          <p><strong>Date:</strong> {selectedInvoice.date}</p>
          <p><strong>Customer:</strong> {selectedInvoice.customerName}</p>

          {/* 🧾 TABLE INVOICE */}
          <div className="mt-3">
            <h4 className="font-semibold mb-2">Items:</h4>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Qty</th>
                  <th style={thStyle}>Rate</th>
                  <th style={thStyle}>Total</th>
                </tr>
              </thead>

              <tbody>
                {selectedInvoice.items?.map((item, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{item.productName}</td>
                    <td style={tdStyle}>{item.quantity}</td>
                    <td style={tdStyle}>৳ {item.price}</td>
                    <td style={tdStyle}>
                      ৳ {Number(item.quantity || 0) * Number(item.price || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 font-bold text-lg">
            Total: {selectedInvoice.totalAmount} ৳
          </p>
        </div>
      )}
    </div>
  );
};

export default OldInvoice;