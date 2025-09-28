import React, { useState, useEffect } from "react";
import LandingNavbar from "../components/LandingNavbar";
import treeVector from "../components/images/ThreeDtreevector.png"; // make sure path is correct

export default function Home() {
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    const handleViewCheck = () => {
      setMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleViewCheck);
    handleViewCheck();

    return () => window.removeEventListener("resize", handleViewCheck);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <LandingNavbar />

      <div
        className={`flex flex-1 ${
          mobileView ? "flex-col" : "flex-row"
        } overflow-hidden`}
      >
        {/* Left Image */}
        <div className="flex-1 flex justify-center items-center p-4 bg-white">
          <img
            src={treeVector}
            alt="3D Tree"
            className="max-h-[80%] max-w-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Right Scroll Stack */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {["Fast", "Smart", "Sustainable", "Community"].map((title, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                {title}
              </h2>
              <p className="text-gray-700">
                This is a short description about {title.toLowerCase()} features.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
