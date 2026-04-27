import React, { useState, useEffect } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  addDoc, // ✅ ADD করা হয়েছে
} from "firebase/firestore";
import { db } from "../firebase/config";

const Memo = () => {

  const getInitialSerial = () => {
    const last = localStorage.getItem("memoSerial");
    return last ? Number(last) + 1 : 1;
  };

  const [serial, setSerial] = useState(getInitialSerial());
  const displaySerial = `MEMO-${new Date().getFullYear()}-${String(serial).padStart(5, "0")}`;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const snap = await getDocs(collection(db, "stocks"));

      const list = snap.docs
        .map((d) => d.data()?.productName?.trim())
        .filter(Boolean);

      setProducts(list);
    };

    loadProducts();
  }, []);

  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [items, setItems] = useState([{ product: "", qty: "", price: "" }]);
  const [previous, setPrevious] = useState(0);
  const [deposit, setDeposit] = useState(0);

  const handleCustomer = (e) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });

  const handleItem = (index, field, value) => {
    const data = [...items];
    data[index][field] = value;
    setItems(data);
  };

  const addItem = () =>
    setItems([...items, { product: "", qty: "", price: "" }]);

  const removeItem = (index) =>
    items.length > 1 && setItems(items.filter((_, i) => i !== index));

  const totalPrice = items.reduce(
    (sum, i) => sum + Number(i.qty || 0) * Number(i.price || 0),
    0
  );

  const subTotal = totalPrice + Number(previous || 0);
  const due = subTotal - Number(deposit || 0);

  // 🔥 MAIN FIX HERE
  const handlePrint = async () => {
    try {

      // ✅ STOCK UPDATE (unchanged)
      for (const item of items) {

        if (!item.product || !item.qty) continue;

        const q = query(
          collection(db, "stocks"),
          where("productName", "==", item.product)
        );

        const snap = await getDocs(q);

        if (snap.empty) {
          alert(`${item.product} stock a nai`);
          return;
        }

        const stockDoc = snap.docs[0];
        const oldQty = Number(stockDoc.data().quantity || 0);

        const sellQty = Number(item.qty);

        if (oldQty < sellQty) {
          alert(`${item.product} stock kom ase`);
          return;
        }

        await updateDoc(doc(db, "stocks", stockDoc.id), {
          quantity: oldQty - sellQty,
        });
      }

      // ✅ DATE FORMAT
      const now = new Date();
      const date = now.toISOString().split("T")[0];

      // ✅ FIRESTORE SAVE (NEW ADD)
      await addDoc(collection(db, "invoices"), {
        serial: displaySerial,
        date: date,
        createdAt: now,

        customerName: customer.name,
        phone: customer.phone,
        address: customer.address,

        items: items.map(i => ({
          productName: i.product,
          quantity: Number(i.qty),
          price: Number(i.price),
        })),

        totalAmount: totalPrice,
        previousAmount: previous,
        deposit: deposit,
        due: due,
      });

      // 🖨️ PRINT
      window.print();

    } catch (error) {
      console.error(error);
      alert("Error saving invoice");
    }
  };

  useEffect(() => {
    const afterPrint = () => {
      const nextSerial = serial + 1;
      setSerial(nextSerial);
      localStorage.setItem("memoSerial", nextSerial);
    };

    window.addEventListener("afterprint", afterPrint);
    return () => window.removeEventListener("afterprint", afterPrint);
  }, [serial]);

  const MemoBox = ({ copy }) => (
    <div className="memo-box">

      <div className="shop-header">
        <h1>M/S RAFI ENTERPRISE</h1>
        <h2>RAFI WASTE COTTON REFINERY MILLS</h2>
        <p>Hazi Mor, Kaligonj, Satkhira, Khulna</p>
        <p>📞 01718-566556, 01716-423214</p>
      </div>

      <div className="customer-serial-section">
        <div className="customer-info">
          <p><b>Name:</b> {customer.name}</p>
          <p><b>Phone:</b> {customer.phone}</p>
          <p><b>Address:</b> {customer.address}</p>
        </div>

        <div className="serial-info">
          <p><b>MEMO No:</b> {displaySerial}</p>
          <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i, idx) => (
            <tr key={idx}>
              <td>{i.product}</td>
              <td>{i.qty}</td>
              <td>{i.price}</td>
              <td>{Number(i.qty || 0) * Number(i.price || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals-right">
        <div><b>Total Price:</b> ৳ {totalPrice}</div>
        <div><b>Previous Amount:</b> ৳ {previous}</div>
        <div><b>Sub Total:</b> ৳ {subTotal}</div>
        <div><b>Deposit:</b> ৳ {deposit}</div>
        <div className="grand-due"><b>Due:</b> ৳ {due}</div>
      </div>

      <div className="extra"><p>Carrier: </p></div>

      <div className="sign">
        <span>Customer Sign</span>
        <span>Authorized Sign</span>
      </div>

      <p className="copy">{copy}</p>
    </div>
  );

  return (
    <>
      <div className="no-print form">
        <h1>Create Memo</h1>

        <input name="name" placeholder="Customer Name" value={customer.name} onChange={handleCustomer} />
        <input name="phone" placeholder="Phone" value={customer.phone} onChange={handleCustomer} />
        <input name="address" placeholder="Address" value={customer.address} onChange={handleCustomer} />

        {items.map((i, idx) => (
          <div key={idx} className="row">

            <select
              value={i.product}
              onChange={(e) => handleItem(idx, "product", e.target.value)}
              style={{
                border: "1.5px solid #000",
                borderRadius: "5px",
                padding: "6px"
              }}
            >
              <option value="">Product</option>
              {products.map((p, index) => (
                <option key={index} value={p}>{p}</option>
              ))}
            </select>

            <input type="number" placeholder="Qty" value={i.qty} onChange={(e) => handleItem(idx, "qty", e.target.value)} />
            <input type="number" placeholder="Rate" value={i.price} onChange={(e) => handleItem(idx, "price", e.target.value)} />
            <button className="btn-red" onClick={() => removeItem(idx)}>Remove</button>
          </div>
        ))}

        <button className="btn-blue" onClick={addItem}>+ Add Product</button>

        <div className="totals-inputs">
          <label>
            Previous Amount:
            <input type="number" value={previous} onChange={(e) => setPrevious(e.target.value)} />
          </label>

          <label>
            Deposit:
            <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </label>
        </div>

        <button className="btn-green" onClick={handlePrint}>Print Memo</button>
      </div>

      <div className="print-page">
        <MemoBox copy="Customer Copy" />
        <div className="cut-line">✂ ------------------------------------------</div>
        <MemoBox copy="Office Copy" />
      </div>

      <style>{`
        * { box-sizing: border-box; font-family: Arial; }

        .form {
          max-width: 700px;
          margin: 20px auto;
          background: white;
          padding: 20px;
        }

        .form input {
          width: 100%;
          padding: 8px;
          margin-bottom: 8px;
          border: 1.5px solid #000;
          border-radius: 5px;
        }

        .row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 6px;
          margin-bottom: 4px;
        }

        .row input {
          border: 1.5px solid #000;
          border-radius: 5px;
          padding: 6px;
        }

        button {
          padding: 6px 10px;
          margin-top: 8px;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 4px;
        }
        .btn-blue { background: #2563eb; }
        .btn-green { background: #16a34a; margin-left: 6px; }
        .btn-red { background: #dc2626; }

        .totals-inputs { display: flex; gap: 20px; margin-top: 10px; }
        .totals-inputs label { display: flex; flex-direction: column; font-weight: bold; }
        .totals-inputs input { border: 1.5px solid #000; border-radius: 5px; padding: 6px; }

        .print-page { width: 210mm; margin: 20px auto; background: white; padding: 8mm; }
        .memo-box { border: 1px solid black; padding: 10px; font-size: 12px; page-break-inside: avoid; }

        .shop-header {
          text-align: center;
          border-bottom: 1px solid #000;
          padding-bottom: 6px;
          margin-bottom: 6px;
        }
        .shop-header h1 { margin: 0; font-size: 20px; font-weight: 800; }
        .shop-header h2 { margin: 2px 0; font-size: 14px; font-weight: 700; }
        .shop-header p { margin: 2px 0; font-size: 11px; }

        .customer-serial-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 2px;
          font-size: 12px;
        }
        .customer-info p, .serial-info p { margin: 0; padding: 1px 0; }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
        }
        table th, table td {
          border: 1px solid black;
          padding: 4px;
          text-align: center;
        }

        .totals-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-top: 10px;
          gap: 4px;
        }
        .grand-due { font-size: 16px; font-weight: bold; }

        .extra { margin-top: 15px; border-top: 1px dashed #000; height: 40px; }
        .sign { display: flex; justify-content: space-between; margin-top: 25px; }
        .copy { text-align: center; margin-top: 6px; font-weight: bold; }
        .cut-line { text-align: center; font-size: 10px; margin: 6px 0; }

        @media print { .no-print { display: none !important; } }
      `}</style>
    </>
  );
};

export default Memo;