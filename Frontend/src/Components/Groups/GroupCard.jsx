import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import {  useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
export default function GroupCard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedGroups, setRequestedGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [showMyGroups, setShowMyGroups] = useState(false);
  const toast = useRef(null);
  const token = localStorage.getItem("token");
    const [keyword, setKeyword] = useState("");
   const { t } = useTranslation();
  const navigate = useNavigate(); 
  const getGroups = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5555/api/supportGroups/groups`,
        { headers: { Authorization: token } }
      );
      setGroups(data || []);
      const approvedGroups = (data || []).filter((g) => g.state === "APPROVED");
      setMyGroups(approvedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load groups.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    getGroups();
  }, []);

  const handleJoin = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:5555/api/supportGroups/groups/${groupId}/join`,
        {},
        { headers: { Authorization: token } }
      );
      setRequestedGroups((prev) => [...prev, groupId]); 
      await getGroups();

      toast.current.show({
        severity: "success",
        summary: "Join Request Sent",
        detail: "Your request has been sent successfully.",
        life: 3000,
      });
    } catch (error) {
      console.error("Error sending join request:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to send join request.",
        life: 3000,
      });
    }
  };


  const displayedGroups = showMyGroups ? myGroups : groups;

  return (
    <div
      className="p-d-flex p-flex-column p-ai-center p-p-4"
      style={{ marginTop: "70px" }}
    >
      <Toast ref={toast} />

 
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", marginLeft: "20px" }}>
        <Tag
          value={showMyGroups ? `${t("groups.MyGroups")} (${myGroups.length})` : `${t("groups.AllGroups")} (${groups.length})`}
          style={{
            backgroundColor: showMyGroups ? "rgba(0, 122, 217, 0.12)" : "rgba(0, 128, 0, 0.12)",
            color: showMyGroups ? "#007ad9" : "green",
            fontSize: "1.15rem",
            fontWeight: "700",
            padding: "0.45rem 1rem",
            borderRadius: "10px",
          }}
          
        />

        
        <div style={{ marginLeft: "auto", marginRight: "40px" }}>
          <Button
            label={showMyGroups ? `${t("groups.ShowAll")} (${groups.length})` : `${t("groups.Showmy")} (${myGroups.length})`}
            icon={showMyGroups ? "pi pi-list" : "pi pi-users"}
            className="p-button-sm p-button-rounded"
            style={{
              backgroundColor: showMyGroups ? "#007ad9" : "green",
              borderColor: showMyGroups ? "#007ad9" : "green",
              color: "white",
              fontWeight: "500",
              transition: "0.25s",
            }}
            onClick={() => setShowMyGroups((s) => !s)}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-d-flex p-jc-center p-ai-center" style={{ height: "60vh" }}>
          <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="6" />
        </div>
      ) : displayedGroups.length === 0 ? (
        <p style={{ color: "gray", marginTop: "2rem" }}>
          {showMyGroups ? "You have no approved groups." : "No groups available."}
        </p>
      ) : (
        <div className="p-grid p-justify-center" style={{ width: "90%", maxWidth: "1200px", marginLeft: "30px" }}>
          {displayedGroups.map((group) => (
            <div key={group.id} className="p-col-12 p-md-6 p-lg-4" style={{ padding: "1rem" }}>
              <Card
                className="p-shadow-4"
                style={{
                  borderRadius: "14px",
                  backgroundColor: "var(--surface-card)",
                  border: "1px solid var(--surface-border)",
                  overflow: "hidden",
                  transition: "0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                
                <div
                  className="p-d-flex p-jc-between p-ai-center"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.02)",
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid var(--surface-border)",
                  }}
                >
                  <Tag
                    value={String(group.category || "").replace("_", " ")}
                    style={{
                      backgroundColor: "var(--primary-color)",
                      color: "var(--primary-color-text)",
                      textTransform: "capitalize",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      borderRadius: "6px",
                      padding: "0.4rem 0.6rem",
                    }}
                  />
                </div>

                <div style={{ padding: "1rem 1rem 0.5rem 1rem" }}>
                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--text-color)",
                      lineHeight: 1.4,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {group.name}
                  </div>

                  <div
                    style={{
                      color: "var(--text-color-secondary)",
                      fontSize: "0.9rem",
                      minHeight: "60px",
                      lineHeight: 1.5,
                    }}
                  >
                    {group.description}
                  </div>
                </div>

                <div
                  className="p-d-flex p-ai-center p-jc-between"
                  style={{
                    padding: "0.75rem 1rem 1rem 1rem",
                    fontSize: "0.8rem",
                    color: "var(--text-color-secondary)",
                  }}
                >
                  <div className="p-d-flex p-ai-center" style={{ gap: "0.5rem" }}>
                    <i className="pi pi-users" />
                    <span>Community group</span>
                  </div>

                  <div className="p-d-flex p-ai-center" style={{ gap: "0.5rem" }}>
                    <i className="pi pi-shield" />
                    <span>Safe space</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 1rem 1rem 1rem" }}>
                  {group.state === "PENDING" ? (
                    <Button
                      label={t("groups.WaitforResponse")}
                      icon="pi pi-clock"
                      className="p-button-sm p-button-rounded"
                      style={{
                        backgroundColor: "#ccc",
                        borderColor: "#ccc",
                        color: "#333",
                        fontWeight: "500",
                      }}
                      disabled
                    />
                  ) : group.state === "APPROVED" ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
             label={t("groups.chat")}
              icon="pi pi-comments"       
               className="p-button-sm p-button-rounded"
                style={{
              backgroundColor: "#1976d2", 
               borderColor: "#1565c0",    
             color: "white",           
               fontWeight: "600",
             }}
                  onClick={() => navigate(`/main/chat/${group.id}`)}
/>
                        <Button
                      label={t("groups.Joined")}
                      icon="pi pi-check"
                      className="p-button-sm p-button-rounded"
                      style={{
                        backgroundColor: "green",
                        borderColor: "green",
                        color: "white",
                        fontWeight: "500",
                      }}
                      disabled
                    />
                       </div>
                  ) : group.state === "REJECTED" ? (
                    <Button
                      label={t("groups.Rejected")}
                      icon="pi pi-times"
                      className="p-button-sm p-button-rounded"
                      style={{
                        backgroundColor: "#e53935",
                        borderColor: "#e53935",
                        color: "white",
                        fontWeight: "500",
                      }}
                      disabled
                    />
                  ) : requestedGroups.includes(group.id) ? (
                    <Button
                      label="Requested"
                      icon="pi pi-clock"
                      className="p-button-sm p-button-rounded"
                      style={{
                        backgroundColor: "#f0ad4e",
                        borderColor: "#f0ad4e",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      disabled
                    />
                  ) : (
                    <Button
                      label={t("groups.Join")}
                      icon="pi pi-user-plus"
                      className="p-button-sm p-button-rounded"
                      style={{
                        backgroundColor: "var(--primary-color)",
                        borderColor: "var(--primary-color)",
                        color: "var(--primary-color-text)",
                        fontWeight: "500",
                      }}
                      onClick={() => handleJoin(group.id)}
                    />
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
