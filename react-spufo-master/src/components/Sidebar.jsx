import React, { useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { MdHomeFilled } from "react-icons/md";
import Playlists from "./Playlists";
import { setHomeClicked, getHomeClicked, setSelectedPlaylist } from "../utils/sharedVariables";
import Login from "./Login";
import { reducerCases } from "../utils/Constants";
// import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const [{ token }, dispatch] = useStateProvider();
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Initialize isLoggedIn based on token presence
  const isHomeClicked = getHomeClicked();
  // const history = useHistory();
  // Function to handle click on the Home button
  function handleClick() {
    setHomeClicked(true);
    setSelectedPlaylist(null);
    console.log("Home ", isHomeClicked);
  }

  // Function to handle logout click
  const handleLogoutClick = () => {
    // Clear user authentication token or session
    // For example, if you're using localStorage:
    // localStorage.removeItem("token");
    
    if(token){
      dispatch({ type: reducerCases.SET_TOKEN, token: null });
    }
    console.log("Token expired: ",token);
    // Update the isLoggedIn state to indicate the user is logged out
    setIsLoggedIn(false);
    // Reload the page to return to the main page
    window.location.href = window.location.origin;
  };

  return (
    <Container>
      <head>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,400,0,0" />    
      </head>
      <div className="top__links">
        <div className="logo11">
           <h3 className="sidebarSpoofo" style={{fontSize:"24px",paddingLeft:"10%",paddingTop:"5%"}}>ᯤ SPOOFO</h3>      
        </div>
        <ul>
          <li onClick={handleClick}>
            <MdHomeFilled />
            <span>Home</span>
          </li>
          <li>
            <span>My library</span>
          </li>
          {/* Replace onClick with Link to redirect to the Search page */}
          {/* <li> */}
            {/* <Link to="/Search.jsx"> */}
              {/* <MdSearch /> */}
              {/* <span>Search</span> */}
            {/* </Link> */}
          {/* </li> */}
          {/* <li>
            <IoLibrary />
            <span>Your Library</span>
          </li> */}
        </ul>
      </div>
      <Playlists />
      <div className="log" onClick={handleLogoutClick}>
      <a href="#">
            <span class="material-symbols-sharp">
                logout
            </span>
            <h3>Log Out</h3>
        </a>
        </div>
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
  color: #b3b3b3;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .top__links {
    display: flex;
    flex-direction: column;
    .logo {
      text-align: center;
      margin: 1rem 0;
      h2 {
        max-inline-size: 80%;
        block-size: auto;
      }
    }
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      
      li {
        display: flex;
        gap: 1rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: white; /* Add hover effect for Home item */
          margin-left: 1rem; /* Adjust margin for hover effect */
        }
      }
      li:last-child {
        &:hover {
          color: inherit; /* Remove hover effect for My library item */
          margin-left: 0; /* Remove margin for hover effect */
        }
      }
    }
  }
  .log a{
    display: flex;
    margin-left: 1rem;
    margin-bottom: 1rem;
    text-decoration: none;
    color: #b3b3b3;
    gap: 1rem;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    gap: 1rem;
    padding: 1rem;
    &:hover {
    color: white;
    margin-left: 2rem;
    }
  }
`;
