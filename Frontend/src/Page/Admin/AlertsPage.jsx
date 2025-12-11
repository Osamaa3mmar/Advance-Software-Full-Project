import { Card } from "primereact/card";
import { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ToastContext from "../../Context/Toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import axios from "axios";

const BASE_URL = "http://localhost:5555";

export default function AlertsPage() {
  const { t } = useTranslation();
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "GENERAL",
  });

  const alertTypes = [
    { label: t("alerts.types.general"), value: "GENERAL" },
    { label: t("alerts.types.emergency"), value: "EMERGENCY" },
    { label: t("alerts.types.healthTip"), value: "HEALTH_TIP" },
    { label: t("alerts.types.event"), value: "EVENT" },
    { label: t("alerts.types.other"), value: "OTHER" },
  ];

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/alerts/getAlerts`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("alerts.fetchError"),
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleOpenDialog = (alert = null) => {
    if (alert) {
      setEditMode(true);
      setSelectedAlert(alert);
      setFormData({
        title: alert.title,
        description: alert.description,
        type: alert.type,
      });
    } else {
      setEditMode(false);
      setSelectedAlert(null);
      setFormData({
        title: "",
        description: "",
        type: "GENERAL",
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditMode(false);
    setSelectedAlert(null);
    setFormData({
      title: "",
      description: "",
      type: "GENERAL",
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.description) {
        toast.current.show({
          severity: "warn",
          summary: t("common.warning"),
          detail: t("alerts.fillRequired"),
          life: 3000,
        });
        return;
      }

      if (editMode) {
        await axios.put(
          `${BASE_URL}/api/alerts/updateAlert/${selectedAlert.id}`,
          formData,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );
        toast.current.show({
          severity: "success",
          summary: t("common.success"),
          detail: t("alerts.updateSuccess"),
          life: 3000,
        });
      } else {
        await axios.post(`${BASE_URL}/api/alerts/createAlert`, formData, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        toast.current.show({
          severity: "success",
          summary: t("common.success"),
          detail: t("alerts.createSuccess"),
          life: 3000,
        });
      }

      handleCloseDialog();
      fetchAlerts();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("alerts.saveError"),
        life: 3000,
      });
    }
  };

  const handleDelete = async (alertId) => {
    if (!window.confirm(t("alerts.confirmDelete"))) return;

    try {
      await axios.delete(`${BASE_URL}/api/alerts/deleteAlert/${alertId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      toast.current.show({
        severity: "success",
        summary: t("common.success"),
        detail: t("alerts.deleteSuccess"),
        life: 3000,
      });
      fetchAlerts();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("alerts.deleteError"),
        life: 3000,
      });
    }
  };

  const typeBodyTemplate = (rowData) => {
    const severityMap = {
      GENERAL: "info",
      EMERGENCY: "danger",
      HEALTH_TIP: "success",
      EVENT: "warning",
      OTHER: "secondary",
    };

    return <Tag severity={severityMap[rowData.type]} value={rowData.type} />;
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

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.created_at).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {t("alerts.pageTitle")}
          </h2>
          <p className="text-slate-600 mt-1">{t("alerts.pageSubtitle")}</p>
        </div>
        <Button
          label={t("alerts.addNew")}
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
            value={alerts}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage={t("alerts.noAlerts")}
            className="p-datatable-sm"
          >
            <Column field="id" header="ID" sortable style={{ width: "5%" }} />
            <Column
              field="title"
              header={t("alerts.title")}
              sortable
              style={{ width: "20%" }}
            />
            <Column
              field="description"
              header={t("alerts.description")}
              style={{ width: "40%" }}
            />
            <Column
              field="type"
              header={t("alerts.type")}
              body={typeBodyTemplate}
              sortable
              style={{ width: "15%" }}
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
              style={{ width: "5%" }}
            />
          </DataTable>
        )}
      </Card>

      <Dialog
        header={editMode ? t("alerts.editAlert") : t("alerts.addNew")}
        visible={showDialog}
        style={{ width: "600px" }}
        onHide={handleCloseDialog}
        draggable={false}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("alerts.title")} *
            </label>
            <InputText
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full"
              maxLength={25}
              placeholder={t("alerts.titlePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("alerts.type")} *
            </label>
            <Dropdown
              value={formData.type}
              options={alertTypes}
              onChange={(e) => setFormData({ ...formData, type: e.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("alerts.description")} *
            </label>
            <InputTextarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              className="w-full"
              maxLength={1000}
              placeholder={t("alerts.descriptionPlaceholder")}
            />
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
