import axios from "axios";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import PlaylistsCard from "./PlaylistsCard";
import { AiFillClockCircle } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  getSearched,
  setSearched,
  getSongData,
  setTracks,
  setCurrentTrack,
  setCurrentIndex,
  getTracks,
  getCurrentTrack,
  getSelectedPlaylist,
  setSelectedPlaylist,
  getCurrentIndex,
} from "../utils/sharedVariables";


// export let selectedPlaylist = getSelectedPlaylist;
// export const [selectedPlaylist, setSelectedPlaylist] = useState(null);

export default function Home() {
  const [{ token }, dispatch] = useStateProvider();
  const [homePlaylists, setHomePlaylists] = useState([]);
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  let selectedPlaylist = getSelectedPlaylist();
//   export const [selectedPlaylist, setSelectedPlaylist] = useState(null); // State for selected playlist

  const tracks = getTracks();
  const currentIndex = getCurrentIndex();

  // Fetch playlist tracks when selectedPlaylistId changes
  useEffect(() => {
    if (selectedPlaylistId) {
      const fetchPlaylistTracks = async () => {
        try {
          const res = await axios.get(
            `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );
          setTracks(res.data.items);
          setCurrentTrack(res.data?.items[0]?.track);
        } catch (error) {
          console.error("Error fetching playlist tracks:", error);
        }
      };
      fetchPlaylistTracks();
    }
  }, [selectedPlaylistId, token]);

  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]?.track);
  }, [currentIndex, tracks]);

  const handleDownloadClick = async (playlistName, songName) => {
    try {
      var registrationSuccessful=true;
      if(registrationSuccessful){
            // Show downloading notification with playlist and song name
  var notification = document.getElementById('registrationNotification');
  notification.innerHTML = `Downloading ${playlistName} - ${songName}...`;
  notification.style.display = 'block';

  // Simulate a successful download
  await new Promise(resolve => setTimeout(resolve, 5000)); // Simulating download delay

  // Update notification to show download completed
  notification.innerHTML = "Download completed successfully";

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
      }
      const response = await axios.get("http://localhost:3001/download", {
        params: {
          playlistName: playlistName,
          songName: songName,
        },
      });
      console.log("Download request sent successfully", response.data);
    } catch (error) {
      var registrationSuccessful = true;

        if (registrationSuccessful) {
          // Show the notification
          var notification = document.getElementById('registrationNotification');
          notification.innerHTML = "Download failed!! Try again...";
          notification.style.display = 'block';
        }
        setTimeout(() => {
          notification.style.display = 'none';
        }, 3000);
  
      console.error("Error sending download request", error);
    }
  };

  useEffect(() => {
    const getInitialPlaylist = async () => {
      if (selectedPlaylistId) {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );
          const playlistData = {
            id: response.data.id,
            name: response.data.name,
            description: response.data.description.startsWith("<a")
              ? ""
              : response.data.description,
            image: response.data.images[0].url,
            tracks: response.data.tracks.items.map(({ track }) => ({
              id: track.id,
              name: track.name,
              artists: track.artists.map((artist) => artist.name).join(" | "),
              image: track.album.images[2].url,
              duration: track.duration_ms,
              album: track.album.name,
              context_uri: track.uri,
              track_number: track.track_number,
              external_link: track.external_urls.spotify,
            })),
          };
          setSelectedPlaylist(playlistData); // Set the selected playlist state
          console.log("Selected Playlist: ", selectedPlaylist);
          // Dispatch action if needed
          // dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist: playlistData });
        } catch (error) {
          console.error("Error fetching playlist data: ", error);
        }
      }
    };
    getInitialPlaylist();
  }, [token, dispatch, selectedPlaylistId]);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/browse/featured-playlists",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response data:", response.data.playlists.items);
        const playlists = response.data.playlists.items.map(
          ({ name, id, description, images }) => {
            return { name, id, description, image: images[0].url };
          }
        );
        setHomePlaylists(playlists);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getPlaylistData();
  }, [token]);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    console.log("Change current playlist");
    setSelectedPlaylistId(selectedPlaylistId);
  };

  return (
    <Container>
      {!selectedPlaylist && (
        <>
        <div class="notification" id="registrationNotification">
      Registration Successful! You will now be redirected to the login page.
    </div>
        <div className="grid">
          {homePlaylists.map(({ name, id, image, description }) => (
            
            <React.Fragment key={id}>
              {/* <PlaylistsCard
          style={{
            cursor: "pointer",
          }}
            name={name}
            id={id}
            image={image}
            description={description}
            onClick={() => {
              changeCurrentPlaylist(id);
            }}
          /> */}
          
              <CardContainer
                onClick={() => {
                  changeCurrentPlaylist(id);
                }}
              >
                
                <PlaylistCardWrapper>
                  <div className="playlist-card">
                    <PlaylistCardImage>
                      <img src={image} alt="Featured Playlist" />
                    </PlaylistCardImage>
                    <PlaylistCardHeader>
                      <div className="playlist-card-header-title">{name}</div>
                    </PlaylistCardHeader>
                    <PlaylistCardBody>{description}</PlaylistCardBody>
                  </div>
                </PlaylistCardWrapper>
                
              </CardContainer>
              
              {/* Rest of your code */}
            </React.Fragment>
            
          ))}
          </div>
        </>
      )}

      {selectedPlaylist && (
        <>
          <div className="playlist">
            <div className="image">
              <img src={selectedPlaylist.image} alt="selected playlist" />
            </div>
            <div className="details">
              <span className="type">PLAYLIST</span>
              <h1 className="title">{selectedPlaylist.name}</h1>
              <p className="description">{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className="list">
            <div className="header-row">
              <div className="col">
                <span>#</span>
              </div>
              <div className="col">
                <span>TITLE</span>
              </div>
              <div className="col">
                <span>ALBUM</span>
              </div>
              <div className="col">
                <span>
                  <AiFillClockCircle />
                </span>
              </div>
            </div>
            <div className="tracks">
              {selectedPlaylist.tracks.map(
                (
                  {
                    id,
                    name,
                    artists,
                    image,
                    duration,
                    album,
                    context_uri,
                    track_number,
                    external_link,
                  },
                  index
                ) => {
                  const isTrackHovered = index === hoveredTrack;

                  return (
                    <div
                      className={`row ${isTrackHovered ? "hovered" : ""}`}
                      key={id}
                      onMouseEnter={() => setHoveredTrack(index)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      onClick={() => {
                        setCurrentIndex(index);
                      }}
                    >
                      <div className="col">
                        <span>{index + 1}</span>
                      </div>
                      <div className="col detail">
                        <div className="image">
                          <img src={image} alt="track" />
                        </div>
                        <div className="info">
                          <a className="name" href={external_link}>
                            {name}
                          </a>
                          <span>{artists}</span>
                        </div>
                      </div>
                      <div className="col">
                        <span>{album}</span>
                      </div>
                      <div className="col">
                        {isTrackHovered && (
                          <FontAwesomeIcon
                            icon={faDownload}
                            style={{
                              paddingLeft: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleDownloadClick(selectedPlaylist.name, name);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

// Styled Component Container is not used, can be removed if not needed

const Container = styled.div`
  .playlist {
    margin: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    .image {
      img {
        height: 15rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #e0dede;
      .title {
        color: white;
        font-size: 4rem;
      }
    }
  }
  .list {
    .header-row {
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
      margin: 1rem 0 0 0;
      color: #dddcdc;
      position: sticky;
      top: 15vh;
      padding: 1rem 3rem;
      transition: 0.3s ease-in-out;
      background-color: ${({ headerBackground }) =>
        headerBackground ? "#000000dc" : "none"};
    }
    .tracks {
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 5rem;
      .row {
        padding: 0.5rem 1rem;
        display: grid;
        grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        &.hovered {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          color: #dddcdc;
          img {
            height: 40px;
            width: 40px;
          }
        }
        .detail {
          display: flex;
          gap: 1rem;
          .info {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
  .grid{
    display: grid;
grid-template-columns: repeat(4, 1fr);
grid-gap: 10px;
  }
  .alert {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4caf50; /* Green background */
    color: white; /* White text */
    padding: 15px; /* Some padding */
    border-radius: 10px; /* Rounded corners */
    z-index: 9999; /* Ensure it appears above other elements */
    display: none; /* Initially hidden */
    border: 2px solid #2ecc71; /* Green border */
    box-shadow: 0px 4px 10px rgba(46, 204, 113, 0.5); /* Shadow */
  }
  
  .show {
    display: block; /* Show the alert */
  }
  .notification {
    display: none;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    background-color: #28a745;
    color: #fff;
    border-radius: 5px;
    z-index: 1000;
    /* visibility:hidden; */
  }
  
  .text-danger {
    display: none;
    color: rgb(204, 25, 25);
  }
  .notification {
    display: none;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    background-color: #28a745;
    color: #fff;
    border-radius: 5px;
    z-index: 1000;
    /* visibility:hidden; */
  }
  
  .text-danger {
    display: none;
    color: rgb(204, 25, 25);
  }

`;

const CardContainer = styled.div`
&:hover {
  border-radius:2rem;
  background-color: rgb(1,1,1,0.5)
  }
`;

const PlaylistCardWrapper = styled.div`
  
  margin: 10px;
  border: none;
  @media (max-width: 1200px) {
    flex: 1 0 calc(33.33% - 20px); /* Adjust for medium screens */
  }
  @media (max-width: 992px) {
    flex: 1 0 calc(50% - 20px); /* Adjust for small screens */
  }
  @media (max-width: 768px) {
    flex: 1 0 calc(100% - 20px); /* Adjust for extra small screens */
  }
`;

const PlaylistCardImage = styled.div`
  padding: 10px;
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

`;

const PlaylistCardHeader = styled.div`
  color: white;
  padding: 10px;
`;

const PlaylistCardBody = styled.div`
  color: white;
  padding: 10px;
`;
