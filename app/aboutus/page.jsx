"use client";

import React, { useState } from "react";
import "./page.css";
import PastorsModal from "../components/PastorsModal";
import pastorsDetails from "../conf/pastors";
import ourChurchDetails from "../conf/ourChurch";
import seniorPastorDetails from "../conf/seniorPastor";

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState("ourChurch");
  return (
      <div id="about-us" className="mt-36">
        <h1 className="about-us-card text-6xl font-bold text-center mb-8 text-white p-10 shadow-lg">ABOUT US</h1>

        {/* Buttons to switch sections */}
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6 mx-5 md:mx-0">
          <button id= "subtabs"
            onClick={() => setActiveSection("ourChurch")}
            className={`px-4 py-4 font-semibold rounded ${
              activeSection === "ourChurch" ? "text-2xl font-semibold  bg-gradient-to-l from-yellow-100 to-yellow-600 text-white transition-all duration-700 ease-in-out" : "bg-gradient-to-l from-yellow-600 to-yellow-200 text-black transition-all duration-700 ease-in-out"
            }`}
          >
            Our Church
          </button>
          <button id= "subtabs"
            onClick={() => setActiveSection("seniorPastor")}
            className={`px-4 py-4 font-semibold rounded ${
              activeSection === "seniorPastor" ? "text-2xl font-semibold  bg-gradient-to-l from-yellow-100 to-yellow-600 text-white transition-all duration-700 ease-in-out" : "bg-gradient-to-l from-yellow-600 to-yellow-200 text-black transition-all duration-700 ease-in-out"
            }`}
          >
            Senior Pastor
          </button>
          <button id= "subtabs"
            onClick={() => setActiveSection("pastoralTeam")}
            className={`px-4 py-4 font-semibold rounded ${
              activeSection === "pastoralTeam" ? "text-2xl font-semibold  bg-gradient-to-l from-yellow-100 to-yellow-600 text-white transition-all duration-700 ease-in-out" : "bg-gradient-to-l from-yellow-600 to-yellow-200 text-black transition-all duration-700 ease-in-out"
            }`}
          >
            Pastoral Team
          </button>
        </div>

        {/* Our Church Section */}
        {activeSection === "ourChurch" && (
          <section className="fade-in mb-8 mx-5 md:mx-24 pb-5">
            <h2 className="text-4xl font-semibold mb-4 text-white">History</h2>
            <p className="text-lg mb-6 font-bold text-white">{ourChurchDetails[0]}</p>
            <p className="text-lg mb-6 font-bold text-white">{ourChurchDetails[1]}</p>
            <p className="text-lg mb-6 font-bold text-white">{ourChurchDetails[2]}</p>
            <p className="text-lg mb-6 font-bold text-white">{ourChurchDetails[3]}</p>
          </section>
        )}

        {/* Senior Pastor Section */}
        {activeSection === "seniorPastor" && (
          <section className="fade-in mb-8 mx-5 md:mx-24 pb-5">
            <h2 className="text-4xl font-semibold mb-4 text-white">Our Senior Pastor – Rev. N. Johnson</h2>
            <p className="text-lg mb-6 font-bold text-white">{seniorPastorDetails[0]}</p>
            <p className="text-lg mb-6 font-bold text-white">{seniorPastorDetails[1]}</p>
            <p className="text-lg mb-6 font-bold text-white">{seniorPastorDetails[2]}</p>
            <p className="text-lg mb-6 font-bold text-white">{seniorPastorDetails[3]}</p>
            <p className="text-lg mb-6 font-bold text-white">{seniorPastorDetails[4]}</p>
          </section>
        )}

        {/* Pastoral Team Section */}
        {activeSection === "pastoralTeam" && (
          <section className="fade-in mb-6 md:mx-24 pb-5">
            <h2 className="text-4xl font-semibold mt-6 mb-4 ml-5 text-white">Our Pastors</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              { 
              Object.values(pastorsDetails).map((pastor, index) => (
              <div key={index} className="container pastor-container-card">
                <div id="pastors-details" className="card">
                  <div className="face face1">
                    <div className="content">
                      <PastorsModal name={pastor.name} role={pastor.role} description={pastor.description} imageIndex={index + 1}/>
                    </div>
                  </div>
                  <div className="face face2">
                    <h2>{pastor.name}</h2>
                    <h5>{pastor.role}</h5>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </section>
        )}
      </div>
   );
};

export default AboutUs;