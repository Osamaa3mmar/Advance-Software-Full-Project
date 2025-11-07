import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";

export default function HandleRequestPage() {
  const { groupId } = useParams();
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    const response = await axios.get(
      `http://localhost:5555/api/supportGroups/groups/${groupId}/requests`,
      { headers: { Authorization: `${token}` } }
    );
    setRequests(response.data.requests);
  };

  const handleUpdate = async (requestId, status) => {
    await axios.patch(
      `http://localhost:5555/api/supportGroups/requests/${requestId}`,
      { status },
      { headers: { Authorization: `${token}` } }
    );
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-700">
        Group {groupId} - Join Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-slate-500">No pending requests.</p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            className="flex justify-between items-center border rounded-lg p-3 shadow-sm bg-white"
          >
            <div>
              <p className="font-semibold">{req.userName}</p>
              <p className="text-sm text-slate-500">{req.email}</p>
            </div>
            <div className="flex gap-2">
              <Button
                label="Approve"
                icon="pi pi-check"
                className="p-button-success p-button-sm"
                onClick={() => handleUpdate(req.id, "APPROVED")}
              />
              <Button
                label="Reject"
                icon="pi pi-times"
                className="p-button-danger p-button-sm"
                onClick={() => handleUpdate(req.id, "REJECTED")}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
