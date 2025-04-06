import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

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
      if (data?.success) setUsers(data?.users);
    } catch (error) {
      console.log("Error while fetching conversations", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const userId = user.id;
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/conversation/conversations/${userId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) setConversations(data?.conversationsResult);
    } catch (error) {
      console.log("Error while fetching conversations", error);
    }
  };

  const newConversations = async () => {
    try {
      const senderId = user.id;
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/conversation/Client-Service`,
        { senderId, receiverId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) setNewCId(data.newConversation._id);
    } catch (error) {
      console.log("Error while creating conversation", error);
    }
  };

  const fetchMessages = async () => {
    try {
      if (!conversationId) return;
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/conversation/messages/${conversationId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setMesssages(data.messageUserData);
        setConvUserN(data.messageUserData[0]?.user?.name || "");
      }
    } catch (err) {
      console.log("error while fetching message", err);
    }
  };

  const sendMessage = async () => {
    try {
      const senderId = user.id;
      socket.emit("sendMessage", {
        conversationId,
        senderId,
        message,
        rId,
      });

      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/conversation/sendMessage/`,
        { conversationId, senderId, message, receiverId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        setMesssages((prevMessages) => [...prevMessages, { user, message }]);
        setMessage("");
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  // Socket.IO
  useEffect(() => {
    setSocket(io("http://localhost:5001"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user.id);
    socket?.on("getUsers", (users) => {
      console.log("Active users", users);
    });
    socket?.on("getMessage", (data) => {
      const { conversationId, senderId, message } = data;
      setMesssages((prevMessages) => [
        ...prevMessages,
        { conversationId, senderId, message },
      ]);
    });

    return () => {
      socket?.off("getUsers");
      socket?.off("getMessage");
    };
  }, [socket]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user, newCId]);

  useEffect(() => {
    if (receiverId) newConversations();
  }, [receiverId]);

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 text-sm">
  {/* Left Sidebar - Conversations */}
  <div className="w-[300px] bg-white border-r border-gray-200 p-4 overflow-y-auto shadow-md">
    <h2 className="text-xl font-bold text-blue-600 mb-4">Conversations</h2>
    {conversations.map((c) => (
      <div
        key={c.conversationId}
        onClick={() => {
          setConvId(c.conversationId);
          setRId(c.user._id);
        }}
        className="p-3 mb-2 rounded-lg hover:bg-blue-100 bg-white cursor-pointer transition-all shadow-sm"
      >
        <p className="font-semibold text-gray-800">{c?.user?.name}</p>
        <p className="text-xs text-gray-500">{c?.user?.email}</p>
      </div>
    ))}
  </div>

  {/* Main Chat Window */}
  <div className="flex flex-col flex-1 bg-white shadow-inner">
    {/* Header */}
    <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-lg shadow-sm">
      Chat with: {convUserN || "Select a conversation"}
    </div>

    {/* Messages */}
    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-blue-50">
      {messages.length > 0 ? (
        messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-3 rounded-2xl shadow ${
              m.user?.id === user.id
                ? "bg-blue-500 text-white ml-auto"
                : "bg-green-100 text-gray-800 mr-auto"
            }`}
          >
            <p className="text-xs font-bold mb-1">{m.user?.name}</p>
            <p className="text-sm">{m.message}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-20">
          No messages yet. Start a conversation!
        </p>
      )}
    </div>

    {/* Input */}
    <div className="p-4 border-t bg-white flex items-center gap-3 shadow-md">
      <input
        type="text"
        className="flex-1 p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition"
      >
        Send
      </button>
    </div>
  </div>

  {/* Right Sidebar - Users */}
  <div className="w-[300px] bg-white border-l border-gray-200 p-4 overflow-y-auto shadow-md">
    <h2 className="text-xl font-bold text-green-600 mb-4">Start New Chat</h2>
    {users.map((u, i) => (
      <div
        key={i}
        onClick={() => setReceiverId(u._id)}
        className="p-3 mb-2 rounded-lg hover:bg-green-100 bg-white cursor-pointer transition-all shadow-sm"
      >
        <p className="font-semibold text-gray-800">{u.name}</p>
        <p className="text-xs text-gray-500">{u.email}</p>
      </div>
    ))}
  </div>
</div>

  );
};

export default DashBoard;
