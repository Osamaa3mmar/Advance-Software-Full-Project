import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";

const initialFakeFiles = [
  {
    id: 1,
    name: "Patient-Record-001.pdf",
    type: "PATIENT_RECORD",
    status: "PENDING",
    size: "1.2 MB",
    uploadedBy: "Admin",
    uploadedAt: "2025-10-20T10:24:00Z",
    url: "https://res.cloudinary.com/demo/image/upload/v1690000000/samples/pdf-sample.pdf",
  },
  {
    id: 2,
    name: "Healthy-Diet-Guide.pdf",
    type: "HEALTH_GUIDE",
    status: "PENDING",
    size: "820 KB",
    uploadedBy: "Sarah",
    uploadedAt: "2025-10-22T14:12:00Z",
    url: "https://res.cloudinary.com/demo/image/upload/v1690000000/samples/landscapes/nature-mountains.jpg",
  },
  {
    id: 3,
    name: "Doctor-Certificate-123.png",
    type: "DOCTOR_CERTIFICATE",
    status: "APPROVED",
    size: "12.4 MB",
    uploadedBy: "Samir",
    uploadedAt: "2025-10-21T08:00:00Z",
    url: "https://res.cloudinary.com/demo/video/upload/v1690000000/samples/sea-turtle.mp4",
  },
  {
    id: 4,
    name: "Misc-Notes.docx",
    type: "OTHER",
    status: "REJECTED",
    size: "340 KB",
    uploadedBy: "Mona",
    uploadedAt: "2025-10-19T09:45:00Z",
    url: "https://res.cloudinary.com/demo/raw/upload/v1690000000/samples/sample.docx",
  },
];

const statusSeverity = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
};

const typeIcon = {
  PATIENT_RECORD: "pi pi-file-pdf text-red-500",
  HEALTH_GUIDE: "pi pi-book text-green-600",
  DOCTOR_CERTIFICATE: "pi pi-id-card text-purple-600",
  OTHER: "pi pi-file text-slate-600",
};

export default function FilesPage() {
  const { t } = useTranslation();

  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await delay(1000);
      if (mounted) {
        setFiles(initialFakeFiles);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const updateFileStatus = async (id, newStatus) => {
    // Optimistic update; replace with API call when endpoint is provided
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    // TODO: call backend endpoint here
    // try { await axios.patch(`/api/files/${id}/status`, { status: newStatus }) } catch (e) { rollback }
  };

  const statusOptions = [
    { label: t("admin.files.filterStatus"), value: null },
    { label: t("admin.files.status.approved"), value: "APPROVED" },
    { label: t("admin.files.status.pending"), value: "PENDING" },
    { label: t("admin.files.status.rejected"), value: "REJECTED" },
  ];

  // typeOptions removed per request: only keep status filter

  const statusChangeOptions = [
    { label: t("admin.files.status.approved"), value: "APPROVED" },
    { label: t("admin.files.status.pending"), value: "PENDING" },
    { label: t("admin.files.status.rejected"), value: "REJECTED" },
  ];

  const filtered = useMemo(() => {
    return files
      .filter((f) => (status ? f.status === status : true))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }, [files, status]);

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

      {/* List */}
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
                  <i className={`${typeIcon[file.type]} text-xl`}></i>
                </div>
                <div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-800 hover:text-blue-600 hover:underline"
                  >
                    {file.name}
                  </a>
                  <div className="text-xs text-slate-500">{file.size}</div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="text-slate-700">
                  <span className="text-slate-500">Type: </span>
                  {t(
                    `admin.files.type.${
                      file.type === "PATIENT_RECORD"
                        ? "patientRecord"
                        : file.type === "HEALTH_GUIDE"
                        ? "healthGuide"
                        : file.type === "DOCTOR_CERTIFICATE"
                        ? "doctorCertificate"
                        : "other"
                    }`
                  )}
                </div>
                <div className="text-slate-700">
                  <span className="text-slate-500">Uploaded by: </span>
                  {file.uploadedBy}
                </div>
                <div className="text-slate-700">
                  <span className="text-slate-500">Date: </span>
                  {new Date(file.uploadedAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <Tag
                  value={t(`admin.files.status.${file.status.toLowerCase()}`)}
                  severity={statusSeverity[file.status]}
                />
                <Dropdown
                  value={file.status}
                  options={statusChangeOptions}
                  onChange={(e) => updateFileStatus(file.id, e.value)}
                  placeholder={t("admin.files.changeStatus")}
                  className="w-44"
                />
                <Button
                  label={t("admin.files.open")}
                  icon="pi pi-external-link"
                  onClick={() => window.open(file.url, "_blank", "noopener")}
                  className=""
                  outlined
                />
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
