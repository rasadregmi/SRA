import React from "react";

import { useNavigate } from "react-router-dom"; // Import useNavigate
import image1 from "../asset/image1.png";  // Ensure the directory is correct
import "./Home.css";

function Home() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle the button click
  const handleReportClick = () => {
    navigate('/report'); // Navigate to the report page
  };

  return (
    <div className="homeContainer"> {/* Wrap everything in a single container */}
      <div className="homepg"> {/* Home page content */}
        <img src={image1} alt="Fraud Prevention" className="img" />
        <div className="name">
          <h1>Protect from Fraud: Know the Signs.</h1>
          <h1>SAVE YOUR PROPERTY. REPORT THE SCAM!!!</h1>
          <p>
            Protect what's rightfully yours. Don't let scammers take away your property or your rights.
            Act now—report activities before it's too late.
          </p>
          <button type="submit" className="button" onClick={handleReportClick}>Report Scam</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
