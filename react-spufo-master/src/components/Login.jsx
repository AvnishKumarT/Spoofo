import React from "react";
import styled from "styled-components";
import './styles.css';

export default function Login() {
  const handleClick = async () => {
    const client_id = "9424d54fe5fb44b3b02c5b0790335fa3";
    const redirect_uri = "http://localhost:3000/callback";
    const api_uri = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-private",
      "user-read-email",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
    ];
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      " "
    )}&response_type=token&show_dialog=true`;
  };
  
  return (
    <html>
      <body>
        <div className="container">
          <h1><span className="logo">ᯤ</span> SPOOFO</h1>
          <button onClick={handleClick}>Connect to SPOOFO</button>
        </div>
      <div className="everything"> 
        <div className="page2">
          <div className="steps">
            <h2></h2>
            <div className="step1">
              <div className="left">
                
              </div>
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
              <div className="right">
                
              </div>
            </div>
          </div>
        </div>
        <div className="page4">
        <div className="steps">
            <div className="step1">
              <div className="left">
              
              </div>
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
