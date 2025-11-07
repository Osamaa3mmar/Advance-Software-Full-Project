import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ToastContext from "../../../Context/Toast";
import GroupItem from "./GroupItem";

export default function GroupsPage() {
  const { toast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5555/api/supportGroups/groups",
        { headers: { Authorization: `${token}` } }
      );
      setGroups(response.data.groups || response.data);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to fetch groups",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this group?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await axios.delete(
            `http://localhost:5555/api/supportGroups/groups/${id}`,
            { headers: { Authorization: `${token}` } }
          );
          toast.current.show({
            severity: "success",
            summary: "Deleted",
            detail: "Group deleted successfully",
            life: 3000,
          });
          fetchGroups();
        } catch (error) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail:
              error.response?.data?.message || "Failed to delete group",
            life: 3000,
          });
        }
      },
    });
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setEditForm({ name: group.name, description: group.description || "" });
    setShowEditDialog(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedGroup) {
      toast.current.show({
        severity: "warn",
        summary: "No group",
        detail: "No group selected to update",
        life: 3000,
      });
      return;
    }
    try {
      await axios.patch(
        `http://localhost:5555/api/supportGroups/groups/${selectedGroup.id}`,
        editForm,
        { headers: { Authorization: `${token}` } }
      );
      toast.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Group information updated successfully",
        life: 3000,
      });
      setShowEditDialog(false);
      fetchGroups();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to update group",
        life: 3000,
      });
    }
  };
  // group item rendering is moved to `GroupItem` component

  const filteredGroups = groups.filter((g) =>
    (g.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <ConfirmDialog />

      <h1 className="text-2xl font-bold text-slate-700">Manage Groups</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <InputText
            placeholder="Search groups by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            label="Add Group"
            icon="pi pi-plus"
            className="p-button-sm p-button-success"
            onClick={() => navigate(`/admin/groups/create`)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-500">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="text-center text-slate-400">No groups available.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <DataView
            value={filteredGroups}
            layout="list"
            itemTemplate={(group) => (
              <GroupItem
                key={group.id}
                group={group}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRequests={(g) => navigate(`/admin/groups/${g.id}/requests`)}
              />
            )}
            paginator
            rows={6}
          />
        </div>
      )}

      {/* Edit Group Dialog */}
      <Dialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        header={`Edit Group${selectedGroup ? ` - ${selectedGroup.name}` : ""}`}
        style={{ width: "500px" }}
        breakpoints={{ "960px": "90vw" }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-600 block mb-1">Name</label>
            <InputText
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              Description
            </label>
            <InputTextarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              rows={4}
              className="w-full"
            />
          </div>
          <Button
            label="Save Changes"
            icon="pi pi-check"
            className="p-button-success w-full"
            onClick={handleUpdateSubmit}
          />
        </div>
      </Dialog>
    </div>
  );
}
