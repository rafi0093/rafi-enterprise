import React from "react";

// Assets
import ownerPic from "../assets/owner.jpg";
import img0943 from "../assets/IMG_0943.jpg";

const Home = () => {
  return (
    <>
      {/* HERO */}
      <section className="bg-green-100 py-20 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-green-700">
          M/S RAFI ENTERPRISE
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Trusted Cotton & Recycling Solutions in Bangladesh
        </p>

        <button className="mt-8 px-8 py-3 bg-green-600 text-white rounded-lg">
          Contact Us
        </button>
      </section>

      {/* OWNER */}
      <section className="py-20 bg-white text-center px-4">
        <img
          src={ownerPic}
          alt="Owner"
          className="h-40 w-40 rounded-full mx-auto border-4 border-green-600"
        />
        <h2 className="mt-6 text-2xl font-semibold text-green-700">
          Tasnimul Hasan Rafi
        </h2>
        <p className="text-gray-600">Founder & Owner</p>
      </section>

      {/* PRODUCTS */}
      <section className="py-20 bg-gray-100 text-center px-4">
        <h2 className="text-3xl font-bold text-green-700 mb-10">
          Our Products
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          <div className="bg-white p-5 rounded shadow">
            <img
              src={img0943}
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="mt-3 font-bold">Recycled Cotton</h3>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <img
              src="https://via.placeholder.com/300"
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="mt-3 font-bold">Jute Processing</h3>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <img
              src="https://via.placeholder.com/300"
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="mt-3 font-bold">Custom Supply</h3>
          </div>

        </div>
      </section>
    </>
  );
};

export default Home;