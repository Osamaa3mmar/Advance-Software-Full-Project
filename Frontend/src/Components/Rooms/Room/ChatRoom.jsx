/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { useEffect, useState, useRef } from "react";
import socket from "../../../Socket";
import { jwtDecode } from "jwt-decode";
import MessageBubble from "./MessageBubble";
import ChatInputBox from "./ChatInputBox";
import { useNavigate } from "react-router-dom";

export default function ChatRoom({ setVisable }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleEndCall = () => {
    // Disconnect from socket and navigate to home
    socket.disconnect();
    navigate("/");
  };

  const sendMessage = () => {
    if (input === "") {
      return;
    } else {
      let message = {
        content: input,
        senderId: user?.id,
        senderDisplayName: user?.first_name ? user.first_name : user.email,
        timeStamp: Date.now(),
      };
      socket.emit("message", JSON.stringify(message));
      setInput("");
    }
  };
  const getUserInfo = () => {
    let user = jwtDecode(localStorage.getItem("token"));
    console.log(user);
    setUser(user);
  };

  useEffect(() => {
    getUserInfo();
    socket.on("message", (msg) => {
      console.log(msg);
    });
    socket.on("newMessage", (msg) => {
      let newMessage = JSON.parse(msg);
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("message");
      socket.off("newMessage");
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="header flex justify-between items-center px-8 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="pi pi-inbox" style={{ fontSize: "22px" }}></p>
          <h3 className="text-2xl font-medium">Chat Box</h3>
        </div>
        <Button
          icon={"pi pi-times"}
          rounded
          text
          onClick={() => {
            setVisable((prev) => !prev);
          }}
        />
      </div>

      <div className="messageBox flex-1 overflow-y-auto bg-gray-50">
        <div className="py-4">
          {messages.map((msg, index) => {
            return (
              <MessageBubble key={index} currentUser={user} message={msg} />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInputBox 
        input={input} 
        setInput={setInput} 
        onSend={sendMessage} 
        onEndCall={handleEndCall}
      />
    </div>
  );
}
