import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";


export default function ChatPage() {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate=useNavigate();

  const getAllMessages = async () => {
    if (!groupId) return;
    try {
      const response = await axios.get(
        `http://localhost:5555/api/group/messages/${groupId}`,
        { headers: { Authorization: token } }
      );
      setMessages(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  useEffect(() => {
    getAllMessages();
    const interval = setInterval(getAllMessages, 3000);
    return () => clearInterval(interval);
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() && !file) return;
    const formData = new FormData();
    formData.append("groupId", groupId);
    if (newMessage) formData.append("message", newMessage);
    if (file) formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:5555/api/group/messages/sendmessage",
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setNewMessage("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      getAllMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div  style={{height: "100vh",   display: "flex",   flexDirection: "column",   backgroundColor: "#f0f2f5",  }}  >

      <div
        style={{
          backgroundColor: "#00b5d1",
          color: "white",
          padding: "1.25rem 2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
         
        }}
      >

        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600" }}>
          Group Chat
        </h2>
        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", opacity: 0.9 }}>
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </p>

   <div style={{margin:'5px'}} >
    <Button label="Back" severity="secondary" onClick={()=>navigate('/main/groups')} />
</div>

      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {!messages || messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#6b7280",
            }}
          >
            <i
              className="pi pi-comments"
              style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}
            />
            <p style={{ fontSize: "1.1rem" }}>No messages yet</p>
            <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                gap: "0.75rem",
                animation: "fadeIn 0.3s ease-in",
              }}
            >
              <Avatar
                label={getInitials(msg.first_name, msg.last_name)}
                style={{
                  backgroundColor: "#00b5d1",
                  color: "white",
                  flexShrink: 0,
                }}
                shape="circle"
                size="large"
              />
              <Card
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#1f2937",
                      fontSize: "1rem",
                    }}
                  >
                    {msg.first_name} {msg.last_name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                    }}
                  >
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    color: "#374151",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.message}
                </div>
                {msg.asset_link && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <img
                      src={msg.asset_link}
                      alt="attachment"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(msg.asset_link, "_blank")}
                    />
                  </div>
                )}
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem 2rem",
          borderTop: "1px solid #e5e7eb",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {file && (
          <div
            style={{
              marginBottom: "0.75rem",
              padding: "0.5rem 0.75rem",
              backgroundColor: "#eff6ff",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.9rem", color: "#1e40af" }}>
              <i className="pi pi-paperclip" style={{ marginRight: "0.5rem" }} />
              {file.name}
            </span>
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-text p-button-sm"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              style={{ color: "#dc2626" }}
            />
          </div>
        )}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          <InputTextarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={2}
            placeholder="Type your message... (Press Enter to send)"
            style={{
              flex: 1,
              borderRadius: "12px",
              border: "2px solid #e5e7eb",
              fontSize: "0.95rem",
              resize: "none",
            }}
            autoResize
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
            id="file-upload"
          />
          <Button
            icon="pi pi-paperclip"
            className="p-button-rounded p-button-outlined"
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: "48px",
              width: "48px",
              borderColor: "#2563eb",
              color: "#2563eb",
            }}
            tooltip="Attach file"
            tooltipOptions={{ position: "top" }}
          />
          <Button
            icon="pi pi-send"
            className="p-button-rounded"
            onClick={handleSend}
            disabled={!newMessage.trim() && !file}
            style={{
              height: "48px",
              width: "48px",
              backgroundColor: "#2563eb",
              borderColor: "#2563eb",
            }}
            tooltip="Send message"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}