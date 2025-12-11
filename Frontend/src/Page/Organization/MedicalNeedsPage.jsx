import { Card } from "primereact/card";
import { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ToastContext from "../../Context/Toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import axios from "axios";

const BASE_URL = "http://localhost:5555";

export default function MedicalNeedsPage() {
  const { t } = useTranslation();
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [medicalNeeds, setMedicalNeeds] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    price: 0,
    quantity: 0,
    is_request: 0,
  });

  const typeOptions = [
    { label: t("medicalNeeds.types.medication"), value: "MEDICATION" },
    { label: t("medicalNeeds.types.equipment"), value: "EQUIPMENT" },
    { label: t("medicalNeeds.types.supplies"), value: "SUPPLIES" },
    { label: t("medicalNeeds.types.surgery"), value: "SURGERY" },
    { label: t("medicalNeeds.types.therapy"), value: "THERAPY" },
    { label: t("medicalNeeds.types.diagnostic"), value: "DIAGNOSTIC" },
    { label: t("medicalNeeds.types.consultation"), value: "CONSULTATION" },
    { label: t("medicalNeeds.types.other"), value: "OTHER" },
  ];

  const fetchMedicalNeeds = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/medicalNeeds`, {
        headers: { Authorization: localStorage.getItem("orgToken") },
      });
      setMedicalNeeds(data || []);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("medicalNeeds.fetchError"),
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchMedicalNeeds();
  }, [fetchMedicalNeeds]);

  const handleOpenDialog = (need = null) => {
    if (need) {
      setEditMode(true);
      setSelectedNeed(need);
      setFormData({
        name: need.name || "",
        description: need.description || "",
        type: need.type || "",
        price: need.price || 0,
        quantity: need.quantity || 0,
        is_request: need.is_request || 0,
      });
    } else {
      setEditMode(false);
      setSelectedNeed(null);
      setFormData({
        name: "",
        description: "",
        type: "",
        price: 0,
        quantity: 0,
        is_request: 0,
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditMode(false);
    setSelectedNeed(null);
    setFormData({
      name: "",
      description: "",
      type: "",
      price: 0,
      quantity: 0,
      is_request: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.type) {
        toast.current.show({
          severity: "warn",
          summary: t("common.warning"),
          detail: t("medicalNeeds.fillRequired"),
          life: 3000,
        });
        return;
      }

      if (editMode) {
        await axios.put(
          `${BASE_URL}/api/medicalNeeds/${selectedNeed.id}`,
          formData,
          {
            headers: { Authorization: localStorage.getItem("orgToken") },
          }
        );
        toast.current.show({
          severity: "success",
          summary: t("common.success"),
          detail: t("medicalNeeds.updateSuccess"),
          life: 3000,
        });
      } else {
        await axios.post(`${BASE_URL}/api/medicalNeeds`, formData, {
          headers: { Authorization: localStorage.getItem("orgToken") },
        });
        toast.current.show({
          severity: "success",
          summary: t("common.success"),
          detail: t("medicalNeeds.createSuccess"),
          life: 3000,
        });
      }

      handleCloseDialog();
      fetchMedicalNeeds();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("medicalNeeds.saveError"),
        life: 3000,
      });
    }
  };

  const handleDelete = async (needId) => {
    if (!window.confirm(t("medicalNeeds.confirmDelete"))) return;

    try {
      await axios.delete(`${BASE_URL}/api/medicalNeeds/${needId}`, {
        headers: { Authorization: localStorage.getItem("orgToken") },
      });
      toast.current.show({
        severity: "success",
        summary: t("common.success"),
        detail: t("medicalNeeds.deleteSuccess"),
        life: 3000,
      });
      fetchMedicalNeeds();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("medicalNeeds.deleteError"),
        life: 3000,
      });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text p-button-sm"
          onClick={() => handleOpenDialog(rowData)}
          tooltip={t("common.edit")}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger p-button-sm"
          onClick={() => handleDelete(rowData.id)}
          tooltip={t("common.delete")}
        />
      </div>
    );
  };

  const typeBodyTemplate = (rowData) => {
    const typeMap = {
      MEDICATION: {
        label: t("medicalNeeds.types.medication"),
        severity: "info",
      },
      EQUIPMENT: {
        label: t("medicalNeeds.types.equipment"),
        severity: "warning",
      },
      SUPPLIES: {
        label: t("medicalNeeds.types.supplies"),
        severity: "success",
      },
      SURGERY: { label: t("medicalNeeds.types.surgery"), severity: "danger" },
      THERAPY: { label: t("medicalNeeds.types.therapy"), severity: "help" },
      DIAGNOSTIC: {
        label: t("medicalNeeds.types.diagnostic"),
        severity: "secondary",
      },
      CONSULTATION: {
        label: t("medicalNeeds.types.consultation"),
        severity: "contrast",
      },
      OTHER: { label: t("medicalNeeds.types.other"), severity: null },
    };
    const typeInfo = typeMap[rowData.type] || typeMap.OTHER;
    return <Tag value={typeInfo.label} severity={typeInfo.severity} />;
  };

  const statusBodyTemplate = (rowData) => {
    const statusMap = {
      PENDING: { label: t("medicalNeeds.status.pending"), severity: "warning" },
      IN_PROGRESS: {
        label: t("medicalNeeds.status.inProgress"),
        severity: "info",
      },
      FULFILLED: {
        label: t("medicalNeeds.status.fulfilled"),
        severity: "success",
      },
      CANCELED: {
        label: t("medicalNeeds.status.canceled"),
        severity: "danger",
      },
    };
    const statusInfo = statusMap[rowData.status] || statusMap.PENDING;
    return <Tag value={statusInfo.label} severity={statusInfo.severity} />;
  };

  const priceBodyTemplate = (rowData) => {
    return `$${parseFloat(rowData.price || 0).toFixed(2)}`;
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.created_at).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {t("medicalNeeds.pageTitle")}
          </h2>
          <p className="text-slate-600 mt-1">
            {t("medicalNeeds.pageSubtitle")}
          </p>
        </div>
        <Button
          label={t("medicalNeeds.addNew")}
          icon="pi pi-plus"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => handleOpenDialog()}
        />
      </div>

      <Card className="shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          </div>
        ) : (
          <DataTable
            value={medicalNeeds}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage={t("medicalNeeds.noNeeds")}
            className="p-datatable-sm"
          >
            <Column field="id" header="ID" sortable style={{ width: "5%" }} />
            <Column
              field="name"
              header={t("medicalNeeds.name")}
              sortable
              style={{ width: "20%" }}
            />
            <Column
              field="type"
              header={t("medicalNeeds.type")}
              body={typeBodyTemplate}
              sortable
              style={{ width: "12%" }}
            />
            <Column
              field="quantity"
              header={t("medicalNeeds.quantity")}
              sortable
              style={{ width: "8%" }}
            />
            <Column
              field="price"
              header={t("medicalNeeds.price")}
              body={priceBodyTemplate}
              sortable
              style={{ width: "10%" }}
            />
            <Column
              field="status"
              header={t("medicalNeeds.status.label")}
              body={statusBodyTemplate}
              sortable
              style={{ width: "12%" }}
            />
            <Column
              field="created_at"
              header={t("common.createdAt")}
              body={dateBodyTemplate}
              sortable
              style={{ width: "15%" }}
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ width: "8%" }}
            />
          </DataTable>
        )}
      </Card>

      <Dialog
        header={
          editMode ? t("medicalNeeds.editNeed") : t("medicalNeeds.addNew")
        }
        visible={showDialog}
        style={{ width: "600px" }}
        onHide={handleCloseDialog}
        draggable={false}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("medicalNeeds.name")} *
            </label>
            <InputText
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
              placeholder={t("medicalNeeds.namePlaceholder")}
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("medicalNeeds.description")}
            </label>
            <InputTextarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full"
              maxLength={2000}
              placeholder={t("medicalNeeds.descriptionPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("medicalNeeds.type")} *
            </label>
            <Dropdown
              value={formData.type}
              options={typeOptions}
              onChange={(e) => setFormData({ ...formData, type: e.value })}
              placeholder={t("medicalNeeds.selectType")}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("medicalNeeds.quantity")}
              </label>
              <InputNumber
                value={formData.quantity}
                onValueChange={(e) =>
                  setFormData({ ...formData, quantity: e.value || 0 })
                }
                className="w-full"
                min={0}
                showButtons
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("medicalNeeds.price")}
              </label>
              <InputNumber
                value={formData.price}
                onValueChange={(e) =>
                  setFormData({ ...formData, price: e.value || 0 })
                }
                className="w-full"
                mode="currency"
                currency="USD"
                locale="en-US"
                min={0}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              inputId="is_request"
              checked={formData.is_request === 1}
              onChange={(e) =>
                setFormData({ ...formData, is_request: e.checked ? 1 : 0 })
              }
            />
            <label
              htmlFor="is_request"
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              {t("medicalNeeds.isRequest")}
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              label={t("common.cancel")}
              className="p-button-text"
              onClick={handleCloseDialog}
            />
            <Button
              label={t("common.save")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
