import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../styles/TitlePage.css";

function TitlePage({ onStart, onLogin, onSignUp }) {
  const [showOptions, setShowOptions] = useState(false);

  const handlePlayWithoutAccount = () => {
    onStart(); // This will start the game without an account
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev); // Toggle the display of login/sign-up buttons
  };

  return (
    <div className="main-page">
      <h1 className="title">AI Debater</h1>

      {/* Buttons */}
      {!showOptions ? (
        <div className="button-group">
          <button className="starting-button" onClick={handlePlayWithoutAccount}>
            Play Without Account
          </button>
          <button className="starting-button" onClick={toggleOptions}>
            Login / Sign Up
          </button>
        </div>
      ) : (
        <div className="button-group">
          <button className="starting-button" onClick={onLogin}>
            Login
          </button>
          <button className="starting-button" onClick={onSignUp}>
            Sign Up
          </button>
          <button className="starting-button back-button" onClick={toggleOptions}>
            Back
          </button>
        </div>
      )}

      {/* Animation */}
      <div className="animation-container">
        <DotLottieReact
          src="https://lottie.host/0663924b-4a44-4765-91d0-80a1507e172b/hX2W4KRfZW.lottie"
          loop
          autoplay
          style={{ width: "300px", height: "300px" }}
        />
      </div>
    </div>
  );
}

export default TitlePage;
