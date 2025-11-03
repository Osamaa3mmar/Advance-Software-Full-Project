import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import socket from "../../../Socket";

export default function ChatRoom({ setVisable }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const sendMessage = () => {
    if (input === "") {
      return;
    } else {
      socket.emit("message", input);
      setInput("");
    }
  };

  useEffect(() => {
    socket.on("message", (msg) => {
      console.log(msg);
    });
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return ()=>{
      socket.off("message")
      socket.off("newMessage")
    }
  }, []);

  return (
    <div className=" h-full ">
      <div className="header flex justify-between items-center px-8 py-4">
        <div className=" flex items-center justify-between gap-2">
          <p className=" pi pi-inbox" style={{ fontSize: "22px" }}></p>
          <h3 className="text-2xl font-medium ">Chat Box</h3>
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
      <div className="messageBox">
        {messages.map((msg, index) => {
          return <p key={index}>{msg}</p>;
        })}
      </div>

      <div className="inputs">
        <input
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          type="text"
        />
        <button
          onClick={() => {
            sendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
