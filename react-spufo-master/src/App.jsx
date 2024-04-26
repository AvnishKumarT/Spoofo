import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";

export default function App() {
  const [{ token }, dispatch] = useStateProvider();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split("&")[0].split("=")[1];
      if (token) {
        dispatch({ type: reducerCases.SET_TOKEN, token });
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 8000); // 10 seconds
      }
    }
    document.title = "Spoofo";
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <LoadingScreen />
      ) : token ? (
        <Spotify />
      ) : (
        <Login />
      )}
    </div>
  );
}

function LoadingScreen() {
  const [displayText, setDisplayText] = useState("");
  const loadingText = "Your playlists are on their way! Just a moment...";

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        gap: "3rem",
        backgroundImage: 'url("music1.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: "black",
        color: "#333",
        boxShadow: "0 2rem 3rem rgba(73, 245, 133, 0.75)",
      }}
    >
      <div style={{ color: "#49f585", textAlign: "center", fontSize: "100px", fontWeight: "bold" }}>
        ᯤ SPOOFO
      </div>
      <div>
        <h2 style={{ color: "white", textAlign: "center", fontSize: "50px", fontWeight: "lighter" }}>
          {displayText}
        </h2>
      </div>
    </div>
  );
}
