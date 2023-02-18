import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const CLIENT_ID = "9907e35b2dc04cb492b082da3599cd45";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchkey, setSearchKey] = useState("");
  const [artist, setArtist] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      
    }
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchArtist = async(e) => {
    e.preventDefault();
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchkey,
        type: "artist"
      }
    })
   setArtist(data.artists.items)

  }

  const renderArtist = () => {
    return artist.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"50%"}src={artist.images[0].url} alt="artist" /> 
        : 
        <div>No Image Found</div>
        }
        {artist.name}

      </div>
    ))
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Log out</button>
        )}

        {token ? (
          <form onSubmit={searchArtist}>
            <input onChange={(e)=> setSearchKey(e.target.value) } type="text" />
            <button type={"submit"}>Search</button>
          </form>
        ) : (
          <h1>Please Login In</h1>
        )}

       {renderArtist()}
      </header>
    </div>
  );
}

export default App;
