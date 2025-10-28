import { Card } from "primereact/card";
import { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ToastContext from "../../Context/Toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import AddOrganizationForm from "../../Components/Organization/AddOrganizationForm";
import axios from "axios";
import { Button } from "primereact/button";
const BASE_URL = "http://localhost:5555";
export default function DashboardPage() {
  const { t } = useTranslation();
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showAddOrgDialog, setShowAddOrgDialog] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const stats = [
    {
      title: t("admin.stats.totalUsers"),
      value: data?.userCount,
      icon: "pi pi-users",
      color: "bg-blue-500",
    },
    {
      title: t("admin.stats.healthGuides"),
      value: data?.healthGuideCount,
      icon: "pi pi-book",
      color: "bg-green-500",
    },
    {
      title: t("admin.stats.activeAlerts"),
      value: data?.alertsCount,
      icon: "pi pi-bell",
      color: "bg-orange-500",
    },
    {
      title: t("admin.stats.organizations"),
      value: data?.organizationCount,
      icon: "pi pi-building",
      color: "bg-purple-500",
    },
  ];

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      await delay(1000);
      const { data } = await axios.get(`${BASE_URL}/api/admin/info`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setData(data.data);
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error while fetching data",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          {t("admin.dashboardTitle")}
        </h2>
        <p className="text-slate-600 mt-1">{t("admin.dashboardSubtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1 group-hover:text-slate-700 transition-colors">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {loading ? (
                    <ProgressSpinner
                      style={{ width: "30px", height: "30px" }}
                      animationDuration=".5s"
                    />
                  ) : (
                    stat.value
                  )}
                </h3>
              </div>
              <div
                className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <i className={`${stat.icon} text-white text-2xl`}></i>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={t("admin.quickActions.title")}
          className="shadow-sm border border-slate-200"
        >
          <div className="grid grid-cols-1 gap-4">
            <button className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <i className="pi pi-plus text-2xl text-slate-400 group-hover:text-blue-500 mb-2"></i>
              <p className="font-medium text-slate-700 group-hover:text-blue-600">
                {t("admin.quickActions.addGuide")}
              </p>
            </button>
            <button className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
              <i className="pi pi-bell text-2xl text-slate-400 group-hover:text-green-500 mb-2"></i>
              <p className="font-medium text-slate-700 group-hover:text-green-600">
                {t("admin.quickActions.createAlert")}
              </p>
            </button>
            <button
              onClick={() => setShowAddOrgDialog(true)}
              className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <i className="pi pi-building text-2xl text-slate-400 group-hover:text-purple-500 mb-2"></i>
              <p className="font-medium text-slate-700 group-hover:text-purple-600">
                {t("admin.quickActions.addOrg")}
              </p>
            </button>
          </div>
        </Card>

        <Card
          title={t("admin.recentPending.title")}
          className="shadow-sm border border-slate-200"
        >
          {(() => {
            const kindIcon = {
              image: "pi pi-image text-blue-500",
              pdf: "pi pi-file-pdf text-red-500",
              video: "pi pi-video text-purple-600",
              doc: "pi pi-file text-slate-600",
              other: "pi pi-file text-slate-600",
            };

            const RecentPendingList = () => {
              const [items, setItems] = useState([]);
              const [loadingList, setLoadingList] = useState(true);

              const fetchRecent = useCallback(async () => {
                try {
                  setLoadingList(true);
                  const { data } = await axios.get(
                    `${BASE_URL}/api/documents/recentPending`,
                    {
                      headers: { Authorization: localStorage.getItem("token") },
                    }
                  );
                  setItems(Array.isArray(data) ? data.slice(0, 6) : []);
                } catch (e) {
                  console.error(e);
                  setItems([]);
                } finally {
                  setLoadingList(false);
                }
              }, []);

              useEffect(() => {
                fetchRecent();
              }, [fetchRecent]);

              if (loadingList) {
                return (
                  <div className="py-6 flex items-center justify-center">
                    <ProgressSpinner
                      style={{ width: 30, height: 30 }}
                      strokeWidth="6"
                    />
                  </div>
                );
              }

              if (!items.length) {
                return (
                  <div className="py-6 text-center text-slate-500 text-sm">
                    {t("admin.files.noFiles")}
                  </div>
                );
              }

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

              // No need to compute a name from link; we display the type as the title

              const getKindFromLink = (link) => {
                if (!link) return "other";
                try {
                  const last =
                    (link.split("?")[0] || "").split("/").pop() || "";
                  const ext = (last.split(".").pop() || "").toLowerCase();
                  if (
                    [
                      "png",
                      "jpg",
                      "jpeg",
                      "gif",
                      "webp",
                      "bmp",
                      "tiff",
                      "svg",
                    ].includes(ext)
                  )
                    return "image";
                  if (["pdf"].includes(ext)) return "pdf";
                  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext))
                    return "video";
                  if (["doc", "docx", "txt", "rtf"].includes(ext)) return "doc";
                  return "other";
                } catch {
                  return "other";
                }
              };

              return (
                <div className="space-y-3">
                  {items.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <i
                          className={`${
                            kindIcon[getKindFromLink(f.link)]
                          } text-lg`}
                        ></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {getTypeLabel(f.type)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(f.created_at).toLocaleString()}
                          {" • "}
                          {t(
                            `admin.files.status.${String(
                              f.status || ""
                            ).toLowerCase()}`
                          )}
                        </p>
                      </div>
                      {f.link && (
                        <Button
                          label={t("admin.files.open")}
                          icon="pi pi-external-link"
                          onClick={() =>
                            window.open(f.link, "_blank", "noopener")
                          }
                          size="small"
                          outlined
                        />
                      )}
                    </div>
                  ))}
                </div>
              );
            };

            return <RecentPendingList />;
          })()}
        </Card>
      </div>

      {/* Add Organization Dialog */}
      <Dialog
        header="Add New Organization"
        visible={showAddOrgDialog}
        style={{ width: "500px" }}
        onHide={() => setShowAddOrgDialog(false)}
        modal
      >
        <AddOrganizationForm
          onSuccess={() => {
            setShowAddOrgDialog(false);
            getData(); // Refresh stats
          }}
          onCancel={() => setShowAddOrgDialog(false)}
        />
      </Dialog>
    </div>
  );
}
