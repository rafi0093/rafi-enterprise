import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Memo from "./pages/Memo";
import AdminStock from "./pages/AdminStock";
import Attendance from "./pages/Attendance";
import Employees from "./pages/Employees";
import Salary from "./pages/Salary";
import TallyKhata from "./pages/TallyKhata";
import OldInvoice from "./pages/OldInvoice";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">

          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/memo"
              element={
                <ProtectedRoute>
                  <Memo />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/stock"
              element={
                <ProtectedRoute>
                  <AdminStock />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/salary"
              element={
                <ProtectedRoute>
                  <Salary />
                </ProtectedRoute>
              }
            />

            {/* 📒 FIXED TALLY KHATA ROUTE */}
            <Route
              path="/tallykhata"
              element={
                <ProtectedRoute>
                  <TallyKhata />
                </ProtectedRoute>
              }
            />

            {/* old invoice route */}
            <Route
              path="/admin/invoice"
              element={
                <ProtectedRoute>
                  <OldInvoice />
                </ProtectedRoute>
              }
            />

          </Routes>

        </main>

        {/* Footer */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;