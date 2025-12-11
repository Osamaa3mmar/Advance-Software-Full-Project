import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function HandleRequestPage() {
  const { groupId } = useParams();
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    const response = await axios.get(
      `http://localhost:5555/api/supportGroups/groups/${groupId}/requests`,
      { headers: { Authorization: `${token}` } }
    );
    setRequests(response.data);
  };

  const handleUpdate = async (requestId, state) => {
    await axios.patch(
      `http://localhost:5555/api/supportGroups/requests/${requestId}`,
      { state },
      { headers: { Authorization: `${token}` } }
    );
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

return (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-slate-700 mb-6">
      Group {groupId} - Join Requests
    </h1>

    <DataTable
      value={requests}
      paginator
      rows={10}
      className="p-datatable-sm shadow-sm rounded-lg"
      emptyMessage="No pending requests"
    >
      <Column field="id" header="ID" sortable />
      <Column field="first_name" header="Name" sortable />
      <Column field="state" header="state" sortable 
        body={(rowData) => (
          <span className={`px-2 py-1 rounded text-sm ${
            rowData.state === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            rowData.state === 'APPROVED' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {rowData.state}
          </span>
        )}
      />
      <Column
        header="Actions"
        body={(rowData) => (
          <div className="flex gap-2">
            {rowData.state === 'PENDING' && (
              <>
                <Button
                  icon="pi pi-check"
                  className="p-button-success p-button-sm"
                  tooltip="Approve"
                  onClick={() => handleUpdate(rowData.id, "APPROVED")}
                />
                <Button
                  icon="pi pi-times"
                  className="p-button-danger p-button-sm"
                  tooltip="Reject"
                  onClick={() => handleUpdate(rowData.id, "REJECTED")}
                />
              </>
            )}
          </div>
        )}
      />
    </DataTable>
  </div>
);

}
