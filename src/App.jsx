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
import Attendance from "./pages/Attendance"; // ✅ FIXED

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

            {/* ✅ ATTENDANCE ROUTE ADDED */}
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <h1 className="text-center py-20 text-xl">
                  404 Page Not Found
                </h1>
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