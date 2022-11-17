import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom'; //natural auto scroll as the convo goes on

//this is where we'll be sending and receiving messages through socket.io. Therefore we need to pass socket as a prop
function Chat({socket, username, room, toggleTheme, theme}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => { //wait for the msg to be sent then update currentMessage
        if(currentMessage !== ""){ //dont allow to send empty message
            //send the message, username, time sent
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit('send_message', messageData); //send the data to the server
            setMessageList((prevMessages) => [...prevMessages, messageData]); //add messages iteratively when we send 
            setCurrentMessage("")
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((prevMessages) => [...prevMessages, data]); //add messages iteratively when we receive 
        })
        return () => socket.removeListener('receive_message');
    }, [socket]); //should call whenever socket changes. socket is localhost -> whenever a new http request is made then..

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Live Chat</p>
        <label class="switch chat" onChange={toggleTheme} checked={theme === 'dark'}>
            <input type="checkbox"/>
            <span class="slider round"></span>
        </label>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'> 
            {messageList.map((msg) => {
                return (
                    <div className='message' id={username === msg.author ? "you" : "other"}>
                        <div>
                            <div className='message-content'>
                                <p>{msg.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id='time'>{msg.time}</p>
                                <p id='author'>{msg.author}</p>
                            </div>
                        </div>
                        
                    </div>
                )
            })} 
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input 
            type='text' 
            placeholder='Type a message...'
            value={currentMessage} //to have control over the value so we can reset it to empty in line 21
            onChange={(event) => {setCurrentMessage(event.target.value)} }
            onKeyPress={(event) => {event.key === "Enter" && sendMessage()}}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
