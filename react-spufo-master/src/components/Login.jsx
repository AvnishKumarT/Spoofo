import React, { useState, useEffect } from "react";
import './styles.css';
// import dotenv from './dotenv';
// import { CLIENT_ID, REDIRECT_URI, API_URI, SCOPE } from '../../credentials';


export default function Login() {
  const [displayText, setDisplayText] = useState("");
  const loadingText = "We're a Spotify song downloading application, dedicated to enhancing your music experience hassle-free. Our service grants us access to your playlists with your consent, allowing you to download songs for free in high quality. Your satisfaction is our top priority, and we're committed to providing a seamless and enjoyable music journey.";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= loadingText.length) {
        setDisplayText(loadingText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust the interval for desired speed
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleClick = async () => {
    const client_id = process.env.REACT_APP_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
const api_uri = process.env.REACT_APP_API_URI;
const scope = process.env.REACT_APP_SCOPE.split(" ");
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      " "
    )}&response_type=token&show_dialog=true`;
  };
  
  return (
    <html>
      <body>
        <div className="container">
          <h1  style={{ marginTop: "-150px",marginBottom:"30px" }}><span className="logo">ᯤ</span> SPOOFO</h1>
          <h2>{displayText}</h2>
          <button className="connectButton" onClick={handleClick}>Connect to SPOOFO</button>
        </div>
        <div className="everything"> 
          <div className="page2">
            <div className="steps">
            <h1 style={{ color: "#49f585", textAlign: "center", fontSize: "54px", fontWeight: "bold", marginTop: "-100px", paddingBottom: "8%", fontFamily: "Roboto" }}>Steps to Use</h1>

              <div className="step1">
                <div className="left"></div>
                <div className="right">
                  <h1> Step 1 </h1>
                  <p>Click on "Connect Spotify"</p>
                </div>
              </div>
            </div>
          </div>
          <div className="page3">
            <div className="steps">
              <div className="step1">
                <div className="left">
                  <h1> Step 2 </h1>
                  <p>Select a playlist to download songs from</p>
                </div>
                <div className="right"></div>
              </div>
            </div>
          </div>
          <div className="page4">
            <div className="steps">
              <div className="step1">
                <div className="left"></div>
                <div className="right">
                  <h1> Step 3 </h1>
                  <p>Click on the Download icon of the desired song</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
