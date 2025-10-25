import { useState, useEffect, useContext } from "react";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import ToastContext from "../../Context/Toast";
import AddOrganizationForm from "../../Components/Organization/AddOrganizationForm";
import OrganizationFilters from "../../Components/Organization/OrganizationFilters";
import OrganizationListItem from "../../Components/Organization/OrganizationListItem";
import OrganizationDetailsDialog from "../../Components/Organization/OrganizationDetailsDialog";
import OrganizationLoadingSkeleton from "../../Components/Organization/OrganizationLoadingSkeleton";
import OrganizationEmptyState from "../../Components/Organization/OrganizationEmptyState";
import axios from "axios";

export default function OrganizationsPage() {
  const { toast } = useContext(ToastContext);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState(-1);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const organizationTypes = [
    { label: "Hospital", value: "HOSPITAL" },
    { label: "Pharmacy", value: "PHARMACY" },
    { label: "Clinic", value: "CLINIC" },
    { label: "Laboratory", value: "LABORATORY" },
    { label: "Charity", value: "CHARITY" },
    { label: "Blood Bank", value: "BLOOD_BANK" },
    { label: "Other", value: "OTHER" },
  ];

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const sortOptions = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Newest First", value: "created_at_desc" },
    { label: "Oldest First", value: "created_at_asc" },
  ];

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
        await delay(1000);
      const { data } = await axios.get(
        "http://localhost:5555/api/admin/organizations/all",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setOrganizations(data.organizations);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message || "Failed to fetch organizations",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (orgId) => {
    confirmDialog({
      message: "Are you sure you want to delete this organization?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await axios.delete(
            `http://localhost:5555/api/admin/organizations/${orgId}`,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Organization deleted successfully",
            life: 3000,
          });
          fetchOrganizations();
        } catch (error) {
          console.error(error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail:
              error.response?.data?.message || "Failed to delete organization",
            life: 3000,
          });
        }
      },
    });
  };

  const handleViewDetails = (org) => {
    setSelectedOrg(org);
    setShowDetailsDialog(true);
  };

  const onSortChange = (value) => {
    const [field, order] = value.split("_");
    setSortField(field);
    setSortOrder(order === "desc" ? -1 : 1);
  };

  const getFilteredOrganizations = () => {
    let filtered = [...organizations];

    // Search filter
    if (globalFilter && globalFilter.trim() !== "") {
      filtered = filtered.filter(
        (org) =>
          org.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          org.email?.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== null && typeFilter !== undefined && typeFilter !== "") {
      filtered = filtered.filter((org) => org.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== null && statusFilter !== undefined) {
      filtered = filtered.filter((org) => org.is_active === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "name") {
        return sortOrder === 1
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 1
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
    });

    return filtered;
  };

  const getTypeLabel = (type) => {
    const typeObj = organizationTypes.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const itemTemplate = (org) => {
    return (
      <OrganizationListItem
        org={org}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        getTypeLabel={getTypeLabel}
      />
    );
  };

  return (
    <div className="space-y-6 p-6">
      <ConfirmDialog />

      <OrganizationFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        organizationTypes={organizationTypes}
        statusOptions={statusOptions}
        sortOptions={sortOptions}
        filteredCount={getFilteredOrganizations().length}
        onAddClick={() => setShowAddDialog(true)}
      />

      {loading && organizations.length === 0 ? (
        <OrganizationLoadingSkeleton />
      ) : getFilteredOrganizations().length === 0 ? (
        <OrganizationEmptyState onAddClick={() => setShowAddDialog(true)} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <DataView
            value={getFilteredOrganizations()}
            layout="list"
            itemTemplate={itemTemplate}
            paginator
            rows={6}
            className="organization-dataview"
          />
        </div>
      )}

      <Dialog
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        header="Add New Organization"
        style={{ width: "600px" }}
        breakpoints={{ "960px": "90vw" }}
      >
        <AddOrganizationForm
          onSuccess={() => {
            setShowAddDialog(false);
            fetchOrganizations();
          }}
        />
      </Dialog>

      <OrganizationDetailsDialog
        visible={showDetailsDialog}
        onHide={() => setShowDetailsDialog(false)}
        organization={selectedOrg}
        getTypeLabel={getTypeLabel}
      />
    </div>
  );
}
