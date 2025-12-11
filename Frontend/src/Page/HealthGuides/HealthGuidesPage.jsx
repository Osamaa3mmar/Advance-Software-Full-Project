import { Card } from "primereact/card";
import { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ToastContext from "../../Context/Toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";

const BASE_URL = "http://localhost:5555";

export default function HealthGuidesPage() {
  const { t } = useTranslation();
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [guides, setGuides] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [translating, setTranslating] = useState({
    category: false,
    title: false,
    content: false,
  });
  const [formData, setFormData] = useState({
    category_en: "",
    category_ar: "",
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
  });

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/healthGuides?skip=0&limit=100`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setGuides(data.data || []);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("healthGuides.fetchError"),
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const handleOpenDialog = (guide = null) => {
    if (guide) {
      setEditMode(true);
      setSelectedGuide(guide);
      const translation = guide.translations?.[0] || {};
      setFormData({
        category_en: translation.category_en || "",
        category_ar: translation.category_ar || "",
        title_en: translation.title_en || "",
        title_ar: translation.title_ar || "",
        content_en: translation.content_en || "",
        content_ar: translation.content_ar || "",
      });
    } else {
      setEditMode(false);
      setSelectedGuide(null);
      setFormData({
        category_en: "",
        category_ar: "",
        title_en: "",
        title_ar: "",
        content_en: "",
        content_ar: "",
      });
    }
    setUploadedFiles([]);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditMode(false);
    setSelectedGuide(null);
    setFormData({
      category_en: "",
      category_ar: "",
      title_en: "",
      title_ar: "",
      content_en: "",
      content_ar: "",
    });
    setUploadedFiles([]);
    setTranslating({ category: false, title: false, content: false });
  };

  const handleTranslate = async (field, sourceLang, targetLang) => {
    const sourceField = `${field}_${sourceLang}`;
    const targetField = `${field}_${targetLang}`;
    const sourceText = formData[sourceField];

    if (!sourceText || !sourceText.trim()) {
      toast.current.show({
        severity: "warn",
        summary: t("common.warning"),
        detail: t("healthGuides.noTextToTranslate"),
        life: 3000,
      });
      return;
    }

    try {
      setTranslating((prev) => ({ ...prev, [field]: true }));

      const { data } = await axios.post(
        `${BASE_URL}/api/translation`,
        {
          message: { content: sourceText },
          targetLang: targetLang,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      setFormData((prev) => ({
        ...prev,
        [targetField]: data.translation || "",
      }));

      toast.current.show({
        severity: "success",
        summary: t("common.success"),
        detail: t("healthGuides.translateSuccess"),
        life: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("healthGuides.translateError"),
        life: 3000,
      });
    } finally {
      setTranslating((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title_en || !formData.content_en) {
        toast.current.show({
          severity: "warn",
          summary: t("common.warning"),
          detail: t("healthGuides.fillRequired"),
          life: 3000,
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append(
        "translations",
        JSON.stringify([
          {
            category_en: formData.category_en,
            category_ar: formData.category_ar,
            title_en: formData.title_en,
            title_ar: formData.title_ar,
            content_en: formData.content_en,
            content_ar: formData.content_ar,
          },
        ])
      );

      uploadedFiles.forEach((file) => {
        formDataToSend.append("files", file);
      });

      if (editMode) {
        await axios.put(
          `${BASE_URL}/healthGuides/${selectedGuide.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.current.show({
          severity: "success",
          summary: t("common.success"),
          detail: t("healthGuides.updateSuccess"),
          life: 3000,
        });
      } else {
        await axios.post(`${BASE_URL}/healthGuides`, formDataToSend, {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        });
        toast.current.show({
          severity: "success",
          summary: t("common.success"),
          detail: t("healthGuides.createSuccess"),
          life: 3000,
        });
      }

      handleCloseDialog();
      fetchGuides();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("healthGuides.saveError"),
        life: 3000,
      });
    }
  };

  const handleDelete = async (guideId) => {
    if (!window.confirm(t("healthGuides.confirmDelete"))) return;

    try {
      await axios.delete(`${BASE_URL}/healthGuides/${guideId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      toast.current.show({
        severity: "success",
        summary: t("common.success"),
        detail: t("healthGuides.deleteSuccess"),
        life: 3000,
      });
      fetchGuides();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: t("common.error"),
        detail: error.response?.data?.message || t("healthGuides.deleteError"),
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

  const titleBodyTemplate = (rowData) => {
    return rowData.translations?.[0]?.title_en || "—";
  };

  const categoryBodyTemplate = (rowData) => {
    return rowData.translations?.[0]?.category_en || "—";
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.created_at).toLocaleString();
  };

  const filesBodyTemplate = (rowData) => {
    return (
      <span className="text-blue-600">
        {rowData.files?.length || 0} {t("healthGuides.files")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {t("healthGuides.pageTitle")}
          </h2>
          <p className="text-slate-600 mt-1">{t("healthGuides.pageSubtitle")}</p>
        </div>
        <Button
          label={t("healthGuides.addNew")}
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
            value={guides}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage={t("healthGuides.noGuides")}
            className="p-datatable-sm"
          >
            <Column field="id" header="ID" sortable style={{ width: "5%" }} />
            <Column
              header={t("healthGuides.category")}
              body={categoryBodyTemplate}
              sortable
              style={{ width: "15%" }}
            />
            <Column
              header={t("healthGuides.title")}
              body={titleBodyTemplate}
              sortable
              style={{ width: "30%" }}
            />
            <Column
              header={t("healthGuides.filesCount")}
              body={filesBodyTemplate}
              style={{ width: "10%" }}
            />
            <Column
              field="created_at"
              header={t("common.createdAt")}
              body={dateBodyTemplate}
              sortable
              style={{ width: "20%" }}
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ width: "10%" }}
            />
          </DataTable>
        )}
      </Card>

      <Dialog
        header={
          editMode ? t("healthGuides.editGuide") : t("healthGuides.addNew")
        }
        visible={showDialog}
        style={{ width: "800px" }}
        onHide={handleCloseDialog}
        draggable={false}
      >
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("healthGuides.categoryEn")}
              </label>
              <div className="flex gap-2">
                <InputText
                  value={formData.category_en}
                  onChange={(e) =>
                    setFormData({ ...formData, category_en: e.target.value })
                  }
                  className="flex-1"
                  placeholder={t("healthGuides.categoryEnPlaceholder")}
                />
                <Button
                  icon="pi pi-language"
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleTranslate("category", "en", "ar")}
                  disabled={translating.category}
                  loading={translating.category}
                  tooltip={t("healthGuides.translateToArabic")}
                  tooltipOptions={{ position: "top" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("healthGuides.categoryAr")}
              </label>
              <div className="flex gap-2">
                <InputText
                  value={formData.category_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, category_ar: e.target.value })
                  }
                  className="flex-1"
                  placeholder={t("healthGuides.categoryArPlaceholder")}
                />
                <Button
                  icon="pi pi-language"
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => handleTranslate("category", "ar", "en")}
                  disabled={translating.category}
                  loading={translating.category}
                  tooltip={t("healthGuides.translateToEnglish")}
                  tooltipOptions={{ position: "top" }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("healthGuides.titleEn")} *
              </label>
              <div className="flex gap-2">
                <InputText
                  value={formData.title_en}
                  onChange={(e) =>
                    setFormData({ ...formData, title_en: e.target.value })
                  }
                  className="flex-1"
                  placeholder={t("healthGuides.titleEnPlaceholder")}
                />
                <Button
                  icon="pi pi-language"
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleTranslate("title", "en", "ar")}
                  disabled={translating.title}
                  loading={translating.title}
                  tooltip={t("healthGuides.translateToArabic")}
                  tooltipOptions={{ position: "top" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("healthGuides.titleAr")}
              </label>
              <div className="flex gap-2">
                <InputText
                  value={formData.title_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, title_ar: e.target.value })
                  }
                  className="flex-1"
                  placeholder={t("healthGuides.titleArPlaceholder")}
                />
                <Button
                  icon="pi pi-language"
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => handleTranslate("title", "ar", "en")}
                  disabled={translating.title}
                  loading={translating.title}
                  tooltip={t("healthGuides.translateToEnglish")}
                  tooltipOptions={{ position: "top" }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  {t("healthGuides.contentEn")} *
                </label>
                <Button
                  icon="pi pi-language"
                  className="p-button-sm bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleTranslate("content", "en", "ar")}
                  disabled={translating.content}
                  loading={translating.content}
                  label={t("healthGuides.toArabic")}
                />
              </div>
              <InputTextarea
                value={formData.content_en}
                onChange={(e) =>
                  setFormData({ ...formData, content_en: e.target.value })
                }
                rows={5}
                className="w-full"
                maxLength={3000}
                placeholder={t("healthGuides.contentEnPlaceholder")}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  {t("healthGuides.contentAr")}
                </label>
                <Button
                  icon="pi pi-language"
                  className="p-button-sm bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => handleTranslate("content", "ar", "en")}
                  disabled={translating.content}
                  loading={translating.content}
                  label={t("healthGuides.toEnglish")}
                />
              </div>
              <InputTextarea
                value={formData.content_ar}
                onChange={(e) =>
                  setFormData({ ...formData, content_ar: e.target.value })
                }
                rows={5}
                className="w-full"
                maxLength={3000}
                placeholder={t("healthGuides.contentArPlaceholder")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("healthGuides.attachFiles")}
            </label>
            <FileUpload
              mode="basic"
              multiple
              accept="image/*,application/pdf"
              maxFileSize={10000000}
              onSelect={(e) => setUploadedFiles(e.files)}
              chooseLabel={t("healthGuides.chooseFiles")}
              className="w-full"
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
