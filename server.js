var express = require("express");
var request = require("request");
var crypto = require("crypto");
var cors = require("cors");
const bodyParser = require("body-parser");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
const axios = require("axios");
// const fetch = require('node-fetch'); // Import the 'node-fetch' library
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
var app = express();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
var https = require("https");
const http = require('http');
const os = require('os');
const path = require("path");
const { Provider } = require("react-redux");
// Enable CORS for all routes
app.use(cors());
require('dotenv').config();

// Your other server setup and routes go here
// console.log("Welcome");
app.get("/download", async function (req, res) {
  // console.log("Received POST request for download:", req.query);
  //Pro gamers api
  const apiKey = process.env.API_KEY; // Replace with your actual YouTube API key
  console.log("YouTube API Key:", apiKey);
  const { playlistName, songName } = req.query;
  console.log("Records name: ", playlistName, songName);
  const query = songName;
  // res.download("C:/Users/Avnish/Desktop/CPP_Practice/WEB_DEV/WADMini/SPOOFO_frontend/spufo-master-final/Downloads/My_Playlist_#2/Pehle_Bhi_Main.mp3");
  try {
    // const filePath = '../react-spufo-master/public/photo.jpg';

    // http.createServer((req, res) => {
    //   fs.readFile(filePath, (err, data) => {
    //     if (err) {
    //       res.writeHead(404, {'Content-Type': 'text/html'});
    //       return res.end("404 Not Found");
    //     }  
    //     res.writeHead(200, {'Content-Type': 'image/jpeg'});
    //     res.write(data);
    //     return res.end();
    //   });
    // }).listen(3000); 
    // Accessing YouTube API to find the URL of the song on YouTube
    const responseYouTube = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 10,
          q: query,
          type: "video",
          key: apiKey,
        },
      }
    );

    // Extract the video ID from the first result
    const videoId = responseYouTube.data.items[0].id.videoId;

    // Construct the YouTube video link
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    console.log("YouTube Video Link:", videoLink);

    // Replace 'output.mp3' with the desired name for the output MP3 file
    // const outputFilePath = `./${playlistName}/${songName}.mp3`;
    
    const sanitizeFileName = (fileName) => {
      // Extract the part before the opening bracket and remove extra spaces
      const sanitizedName = fileName.split("(")[0].trim().replace(/\s+/g, ' ');
      // Replace invalid characters with underscores
      const sanitizedName2 = sanitizedName.replace(/[<>:"/\\|?*]/g, "_");
      const finalFileName = sanitizedName2.replace(/\s+/g, '_');
      return finalFileName;
    };
    
    // Replace 'output.mp3' with the desired name for the output MP3 file
const outputFileName = sanitizeFileName(songName) + ".mp3";
// const outputFilePath = path.join(os.homedir(), 'Downloads', sanitizeFileName(playlistName), outputFileName);
const outputFilePath =  require('os').homedir() + '/Downloads/' + sanitizeFileName(playlistName) + '/' + outputFileName; 

if(!fs.existsSync(require('os').homedir() + '/Downloads/' + sanitizeFileName(playlistName)+ '/')){
  
fs.mkdir(require('os').homedir() + '/Downloads/' + sanitizeFileName(playlistName)+ '/', (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('New folder created successfully!');
}});

}

// Create directory if it doesn't exist
// const directoryPath = path.join(os.homedir(), 'Downloads', sanitizeFileName(playlistName));
// if (!fs.existsSync(directoryPath)) {
//     fs.mkdirSync(directoryPath, { recursive: true });
// }

    
    
      // Save the song blob to the output file path
  // fs.writeFileSync(outputFilePath, await songBlob.arrayBuffer());

  // const link = document.createElement("a");
  // link.href = URL.createObjectURL(songBlob);
  // link.download = outputFileName; // You can set the desired filename here
  // link.click();

    // Download YouTube video
    const videoStream = ytdl(videoLink, {
      quality: "highestaudio",
    });

// Convert video to MP3
ffmpeg()
    .input(videoStream)
    .audioCodec("libmp3lame")
    .toFormat("mp3")
    .on("end", () => {
        console.log("Conversion finished!");

        // Watch the directory for changes
        // const watcher = fs.watch(path.dirname(outputFilePath), (eventType, filename) => {
        //     // Check if the event type is 'rename' (indicating a new file is created)
        //     if (eventType === 'rename' && filename === path.basename(outputFilePath)) {
        //         // If the new file is the one we are waiting for, initiate the download
        //         watcher.close(); // Close the watcher to stop monitoring
        //         const filePath = path.join(__dirname, `${outputFilePath}`);
        //         res.download(filePath, (err) => {
        //             if (err) {
        //                 console.error("Error downloading file:", err);
        //                 // Handle the error
        //                 // res.status(500).json({ success: false, message: "Download failed" });
        //             } else {
        //                 console.log("File downloaded successfully!");
        //             }
        //         });
        //     }
        // });
    })
    .on("error", (err) => {
        console.error("Error during conversion:", err);
        fs.unlinkSync(outputFilePath); // Delete the partially converted file
        // Handle the error
        // res.status(500).json({ success: false, message: "Conversion failed" });
    })
    .save(outputFilePath);
    
    // URL of the image 
    // You can also listen for download progress
    // videoStream.on('progress', (chunkLength, downloaded, total) => {
    //   const percent = (downloaded / total) * 100;
    //   console.log(`Downloaded ${percent.toFixed(2)}%`);
    // });
  } catch (error) {
    console.error(
      "Error fetching YouTube data:",
      error.response ? error.response.data : error.message
    );
    // res.status(500).json({ success: false, message: "Download failed" });
  }
});

app.get("/download/wholePlaylist", async function (req, res) {
  // console.log("Received POST request for download:", req.query);
  //Pro gamers api
  const apiKey = process.env.API_KEY; // Replace with your actual YouTube API key

  const { playlistName, playlistId, access_token } = req.query;
  const playlist_id = playlistId;

  const apiUrlSongsTotal = `https://api.spotify.com/v1/playlists/${playlist_id}`;

  try {
    const responseNumberofSongs = await axios({
      method: "get",
      url: apiUrlSongsTotal,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    TotalSongs = responseNumberofSongs.data.tracks.total;
    console.log("Total songs: ", TotalSongs);
  } catch (error) {
    console.log(
      "Error while getting total number of songs in a playlist: ",
      error
    );
  }

  const apiUrl = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

  try {
    const responseSpotify = await axios({
      method: "get",
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    for (var i = 0; i < TotalSongs; i++) {
      const songId = responseSpotify.data.items[i].track.id;
      const songName = responseSpotify.data.items[i].track.name;

      console.log("Response Data -> ", songId, songName);

      const query = songName;

      // accessing youtube api to find the url of the song on youtube
      try {
        const responseYouTube = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              maxResults: 10,
              q: query,
              type: "video",
              key: apiKey,
            },
          }
        );

        // Extract the video ID from the first result
        const videoId = responseYouTube.data.items[0].id.videoId;

        // Construct the YouTube video link
        const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
        console.log("YouTube Video Link:", videoLink);

        // Replace 'YOUR_YOUTUBE_VIDEO_URL' with the actual YouTube video URL
        const youtubeVideoUrl = videoLink;

        // Replace 'output.mp3' with the desired name for the output MP3 file
        const sanitizeFileName = (fileName) => {
          // Extract the part before the opening bracket and remove extra spaces
          const sanitizedName = fileName.split("(")[0].trim().replace(/\s+/g, ' ');
          // Replace invalid characters with underscores
          return sanitizedName.replace(/[<>:"/\\|?*]/g, "_");
        };
        
    // Replace 'output.mp3' with the desired name for the output MP3 file
    const outputFileName = sanitizeFileName(songName) + ".mp3";
    // const outputFilePath = path.join(os.homedir(), 'Downloads', sanitizeFileName(playlistName), outputFileName);
    const outputFilePath =  require('os').homedir() + '/Downloads/' + sanitizeFileName(playlistName) + '/' + outputFileName; 
    
    if(!fs.existsSync(require('os').homedir() + '/Downloads/' + sanitizeFileName(playlistName)+ '/')){
      
    fs.mkdir(require('os').homedir() + '/Downloads/' + sanitizeFileName(playlistName)+ '/', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('New folder created successfully!');
    }});
    
    }

        
        // Download YouTube video
        const videoStream = ytdl(youtubeVideoUrl, {
          quality: "highestaudio",
        });

        // Convert video to MP3
        ffmpeg()
          .input(videoStream)
          .audioCodec("libmp3lame")
          .toFormat("mp3")
          .on("end", () => {
            console.log("Conversion finished!");

          })
          .on("error", (err) => {
            console.error("Error:", err);
          })
          .save(outputFilePath);

        // You can also listen for download progress
        // videoStream.on('progress', (chunkLength, downloaded, total) => {
        //   const percent = (downloaded / total) * 100;
        //   console.log(`Downloaded ${percent.toFixed(2)}%`);
        // });
      } catch (error) {
        console.error(
          "Error fetching YouTube data:",
          error.response ? error.response.data : error.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Error fetching Spotify data:",
      error.response ? error.response.data : error.message
    );
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
