/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client'

export const DashBoard = () => {
  const [user, setUser] = useState("");
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [conversationId, setConvId] = useState("");
  const [messages, setMesssages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [newCId, setNewCId] = useState("");
  const [socket, setSocket] = useState(null);
  const [rId, setRId] = useState("");
  const [convUserN, setConvUserN] = useState("");
  const messageRef = useRef();
  


  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/conversation/users`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        setUsers(data?.users);
      }
    } catch (error) {
      console.log("Error while fetching conversations", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const userId = user.id;
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_APP_API
        }/api/conversation/conversations/${userId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        setConversations(data?.conversationsResult);
      }
    } catch (error) {
      console.log("Error while fetching conversations", error);
    }
  };

  const newConversations = async () => {
    try {
      const senderId = user.id;
      console.log(typeof receiverId);
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/conversation/Client-Service`,
        {
          senderId,
          receiverId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        setNewCId(data.newConversation._id);
        console.log("New conv Id", data.newConversation._id);
      }
      console.log({
        senderId,
        receiverId,
      });
    } catch (error) {
      console.log("Error while fetching conversations", error);
    }
  };
  const fetchMessages = async () => {
    try {
      if (!conversationId) return;
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_APP_API
        }/api/conversation/messages/${conversationId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setMesssages(data.messageUserData);
        setConvUserN(messages[0]?.user?.name)
       
      }
    } catch (err) {
      console.log("error while fetching message", err);
    }
  };

  const sendMessage = async () => {
    try {

      
      const senderId = user.id;     
      try{
      
      console.log("emmitiing message",  {
        conversationId, senderId , message , rId 
      })
      socket.emit('sendMessage', {
        conversationId,
        senderId,
        message,
        rId
      });
    }catch(err){
      console.log("error while sending message");
    }

      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/conversation/sendMessage/`,
        { conversationId, senderId, message, receiverId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("message sent")
      if (data.success) {
        setMesssages((prevMessages) => [...prevMessages, {user, message}]);
        setMessage(" ");
      }
    } catch (err) {
      console.log("error", err);
    }
  };


  //socket part
  useEffect(()=>{
    setSocket(io('http://localhost:5001'));
},[])

useEffect(()=>{
    socket?.emit('addUser', user.id)
    socket?.on('getUsers', users=>{
        console.log("Active users", users)
    })
    socket?.on('getMessage', data => {
        const {conversationId, senderId ,message} = data;
        console.log("New message received via socket:", data.message);

        setMesssages(prevMessages => [
          ...prevMessages,
          { conversationId, senderId, message }
        ]);                        
    })
    return () => {
      socket?.off('getUsers');
      socket?.off('getMessage');
    };
},[socket])
 
  //end of socket 

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [user, newCId]);

  useEffect(() => {
    if (newCId != null) {
      newConversations();
    }
  }, [receiverId]);

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  return (
    <div>
      <h1>*DashBoard :{user.name}*</h1>
      <div className="flex">
        <div>
          <h1>#####Liste of Conversations####</h1>
          <div>
            {conversations?.map((c) => (
              <div key={c.conversationId}>
                <h1>{c?.user?.email}</h1>
                <h1 onClick={() => { setConvId(c.conversationId); setRId(c.user._id);} }>
                  {c?.user?.name}
                </h1>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div>
            <h1>#######Discussion####</h1>
            <div>
              
              <h1>From: {convUserN}</h1>
              {messages.length > 0 ? (
                messages?.map((m, i) => (
                  <div key={i}>
                    <h2>From : {m.user?.name}</h2>
                    <h2>{m.message}</h2>
                    <div ref={messageRef}></div>
                  </div>
                ))
              ) : (
                <h1>No messages</h1>
              )}
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="type message"
              onChange={(e) => setMessage(e.target.value)}
            />
            <span>
              <button className="bg-blue-500" onClick={() => sendMessage()}>
                Send Message
              </button>
            </span>
          </div>
        </div>
        <div>
          <h1>#####Talk To Users######</h1>
          <div>
            {users?.map((u, i) => (
              <div key={i} onClick={() =>{ setReceiverId(u._id);  
              }} >
                <h1>{u.name}</h1>
                <h1>{u.email}</h1>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
