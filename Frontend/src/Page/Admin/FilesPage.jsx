import { useEffect, useMemo, useState, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import ToastContext from "../../Context/Toast";
import { Tag } from "primereact/tag";

const BASE_URL = "http://localhost:5555";
const kindIcon = {
  image: "pi pi-image text-blue-500",
  pdf: "pi pi-file-pdf text-red-500",
  video: "pi pi-video text-purple-600",
  doc: "pi pi-file text-slate-600",
  other: "pi pi-file text-slate-600",
};

export default function FilesPage() {
  const { t } = useTranslation();
  const {toast}=useContext(ToastContext);
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({}); // { [id]: boolean }
  console.log(files);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      await delay(1000);
      const { data } = await axios.get(`${BASE_URL}/api/documents/all`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(data);
      let tempFiles=data.files
      // Expect array of { id, link, type, created_at, status }
      const normalized = (Array.isArray(tempFiles) ? tempFiles : []).map((d) => ({
        id: d.id,
        link: d.link,
        type: d.type,
        created_at: d.created_at,
        status: d.status, // e.g., "Pending" | "Approved" | "Rejected"
      }));
      setFiles(normalized);
    } catch (e) {
      console.error(e);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const updateFileStatus = async (id, newStatus) => {
    // newStatus expected: "Approved" | "Rejected" | "Pending"
    setUpdating((u) => ({ ...u, [id]: true }));
    const prev = files.find((f) => f.id === id)?.status;
    setFiles((prevList) =>
      prevList.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    try {
      await axios.put(
        `${BASE_URL}/api/documents/status/${id}`,
        { newStatus },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      toast.current.show({
        severity: "success",
        summary: "File status updated",
        detail: `File status changed to ${newStatus}`,
        life: 3000,
      });
    } catch (e) {
      console.error(e);
      // rollback
      setFiles((prevList) =>
        prevList.map((f) => (f.id === id ? { ...f, status: prev } : f))
      );
    } finally {
      setUpdating((u) => ({ ...u, [id]: false }));
    }
  };

  const statusOptions = [
    { label: t("admin.files.filterStatus"), value: null },
    { label: t("admin.files.status.approved"), value: "Approved" },
    { label: t("admin.files.status.pending"), value: "Pending" },
    { label: t("admin.files.status.rejected"), value: "Rejected" },
  ];

  // typeOptions removed per request: only keep status filter

  const statusChangeOptions = [
    { label: t("admin.files.status.approved"), value: "Approved" },
    { label: t("admin.files.status.pending"), value: "Pending" },
    { label: t("admin.files.status.rejected"), value: "Rejected" },
  ];

  const filtered = useMemo(() => {
    return files
      .filter((f) => (status ? f.status === status : true))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [files, status]);

  const getTypeLabel = (type) =>
    t(
      `admin.files.type.${
        type === "PATIENT_RECORD"
          ? "patientRecord"
          : type === "HEALTH_GUIDE"
          ? "healthGuide"
          : type === "DOCTOR_CERTIFICATE"
          ? "doctorCertificate"
          : "other"
      }`
    );

  const getKindFromLink = (link) => {
    if (!link) return "other";
    try {
      const last = (link.split("?")[0] || "").split("/").pop() || "";
      const ext = (last.split(".").pop() || "").toLowerCase();
      if (
        ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff", "svg"].includes(
          ext
        )
      )
        return "image";
      if (["pdf"].includes(ext)) return "pdf";
      if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
      if (["doc", "docx", "txt", "rtf"].includes(ext)) return "doc";
      return "other";
    } catch {
      return "other";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <Card className="border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {t("admin.files.title")}
            </h2>
            <p className="text-slate-600">
              Manage uploaded files and quick access to Cloudinary links
            </p>
          </div>
          {/* removed 'Go to all files' button */}
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-3">
          <Dropdown
            value={status}
            options={statusOptions}
            onChange={(e) => setStatus(e.value)}
            placeholder={t("admin.files.filterStatus")}
            showClear
            className="w-full"
          />
        </div>
      </Card>

      {/* List - styled similar to Recent Pending */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y">
        {loading && (
          <div>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6"
              >
                <div className="flex items-center gap-3 min-w-[220px]">
                  <Skeleton
                    shape="circle"
                    width="2.5rem"
                    height="2.5rem"
                  ></Skeleton>
                  <div className="space-y-2">
                    <Skeleton width="14rem" height="1rem" />
                    <Skeleton width="6rem" height="0.75rem" />
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Skeleton width="8rem" height="1rem" />
                  <Skeleton width="8rem" height="1rem" />
                  <Skeleton
                    width="10rem"
                    height="1rem"
                    className="hidden md:block"
                  />
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <Skeleton width="6rem" height="2rem" />
                  <Skeleton width="11rem" height="2.25rem" />
                  <Skeleton width="6rem" height="2.25rem" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading &&
          filtered.map((file) => (
            <div
              key={file.id}
              className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6"
            >
              <div className="flex items-center gap-3 min-w-[220px]">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <i
                    className={`${
                      kindIcon[getKindFromLink(file.link)]
                    } text-xl`}
                  ></i>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    {getTypeLabel(file.type)}
                  </div>
                  <div className=" text-xs text-slate-500">
                    {new Date(file.created_at).toLocaleString()} •{" "}
                    <Tag value={t(
                      `admin.files.status.${String(
                        file.status || ""
                      ).toLowerCase()}`
                    )} severity={file.status=="Pending"?"warning":file.status=="Rejected"?"danger":"success"}/>
                    
                  </div>
                </div>
              </div>

              <div className="flex-1" />

              <div className="flex items-center gap-3 ml-auto">
                <Dropdown
                  value={file.status}
                  options={statusChangeOptions}
                  onChange={(e) => updateFileStatus(file.id, e.value)}
                  placeholder={t("admin.files.changeStatus")}
                  className="w-44"
                  disabled={!!updating[file.id]}
                />
                {file.link && (
                  <Button
                    label={t("admin.files.open")}
                    icon="pi pi-external-link"
                    onClick={() => window.open(file.link, "_blank", "noopener")}
                    outlined
                  />
                )}
              </div>
            </div>
          ))}

        {!loading && filtered.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            {t("admin.files.noFiles")}
          </div>
        )}
      </div>
    </div>
  );
}
