import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const TallyKhata = () => {
  // 🟢 Customer Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🔍 Search
  const [search, setSearch] = useState("");

  // 📋 Data
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 💰 Transaction
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [note, setNote] = useState("");

  // 🔄 Fetch Customers
  const fetchCustomers = async () => {
    const snap = await getDocs(collection(db, "customers"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ➕ Add Customer
  const handleAddCustomer = async () => {
    if (!name || !phone) return alert("Name & Phone required!");

    await addDoc(collection(db, "customers"), {
      name,
      phone,
      address: address || "",
      totalDue: 0,
      transactions: [],
      createdAt: new Date(),
    });

    setName("");
    setPhone("");
    setAddress("");

    fetchCustomers();
  };

  // 🔍 Filter
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // 💰 Add Transaction
  const handleTransaction = async () => {
    if (!amount || !selectedCustomer) return;

    const value = Number(amount);

    const newBalance =
      type === "credit"
        ? selectedCustomer.totalDue + value
        : selectedCustomer.totalDue - value;

    const newTransaction = {
      type,
      amount: value,
      note: note || "",
      timestamp: new Date(),
    };

    const updatedTransactions = [
      ...(selectedCustomer.transactions || []),
      newTransaction,
    ];

    await updateDoc(doc(db, "customers", selectedCustomer.id), {
      totalDue: newBalance,
      transactions: updatedTransactions,
    });

    setAmount("");
    setNote("");
    fetchCustomers();

    setSelectedCustomer({
      ...selectedCustomer,
      totalDue: newBalance,
      transactions: updatedTransactions,
    });
  };

  // 🕒 Format Date
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">

      {/* 🟢 ADD CUSTOMER */}
      <div className="bg-white shadow rounded-xl p-5 mb-6">
        <h2 className="text-2xl font-bold mb-4">🧾 Add Customer</h2>

        <div className="grid gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            onClick={handleAddCustomer}
            className="bg-green-600 text-white py-2 rounded"
          >
            ➕ Add Customer
          </button>
        </div>
      </div>

      {/* 📋 CUSTOMER LIST */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-bold mb-4">📋 Customers</h2>

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search customer by name..."
          className="border p-2 rounded w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredCustomers.length === 0 ? (
          <p className="text-gray-500">No customer found</p>
        ) : (
          filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCustomer(c)}
              className="border p-3 rounded mb-2 flex justify-between cursor-pointer hover:bg-gray-100"
            >
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-600">{c.phone}</p>
              </div>

              <div className="font-bold">
                ৳ {c.totalDue}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📒 LEDGER */}
      {selectedCustomer && (
        <div className="bg-white shadow rounded-xl p-5 mt-6">

          <h2 className="text-xl font-bold mb-2">
            📒 {selectedCustomer.name} Ledger
          </h2>

          <p className="text-sm text-gray-600 mb-2">
            Phone: {selectedCustomer.phone}
          </p>

          <p className="font-semibold mb-4">
            💰 Balance: ৳ {selectedCustomer.totalDue}
          </p>

          {/* ➕ TRANSACTION */}
          <div className="grid gap-2 mb-4">

            <select
              className="border p-2 rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="credit">Credit (+)</option>
              <option value="debit">Debit (-)</option>
            </select>

            <input
              className="border p-2 rounded"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              className="border p-2 rounded"
              placeholder="Description (e.g. product, reason...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button
              onClick={handleTransaction}
              className="bg-blue-600 text-white py-2 rounded"
            >
              Add Transaction
            </button>

          </div>

          {/* 📜 HISTORY */}
          <div>
            <h3 className="font-semibold mb-2">Transaction History</h3>

            {(selectedCustomer.transactions || []).map((t, i) => (
              <div key={i} className="border-b py-2 text-sm">

                <div className="flex justify-between">
                  <p className={
                    t.type === "credit"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }>
                    {t.type.toUpperCase()}
                  </p>

                  <p className="font-semibold">
                    ৳ {t.amount}
                  </p>
                </div>

                {t.note && (
                  <p className="text-gray-700">
                    📝 {t.note}
                  </p>
                )}

                <p className="text-gray-500 text-xs">
                  {formatDateTime(t.timestamp)}
                </p>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default TallyKhata;