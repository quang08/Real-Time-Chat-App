import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
//contextAPI for dark/light mode
import { createContext } from "react";
export const ThemeContext = createContext(null);

const socket = io.connect("http://localhost:3001"); //connect with the backend

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [theme, setTheme] = useState("light"); //dark/light mode

  //function to join a room: establish the connection between the user that entered the app and the room they want to join
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      //only enter a rooom if there's an username and a room
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  //toggle theme
  const toggleTheme = () => {
    setTheme((currTheme) => (currTheme === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div className="App" id={theme}>
        {!showChat ? ( //if showchat = false (default) then show only the join a chat page
          <div className="joinChatContainer">
            <h3>Join A Chat</h3>
            <input
              type="text"
              placeholder="Username..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            ></input>
            <input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            ></input>
            <button onClick={joinRoom}>Join</button>
            <label class="switch" onChange={toggleTheme} checked={theme === 'dark'}>
              <input type="checkbox"/>
              <span class="slider round"></span>
            </label>
          </div>
        ) : (
          //else show chat box
          <Chat socket={socket} username={username} room={room} toggleTheme={toggleTheme} theme={theme}/>
        )}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
