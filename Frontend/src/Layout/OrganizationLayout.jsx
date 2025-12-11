import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../Components/LanguageToggle/LanguageToggle";
import axios from "axios";
import { Tooltip } from "primereact/tooltip";

export default function OrganizationLayout() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const token = localStorage.getItem("orgToken");
      console.log("Token:", token);

      if (!token) {
        console.error("No token found, redirecting to login...");
        navigate("/login/organaization");
        return;
      }

      const { data } = await axios.get(
        "http://localhost:5555/api/organization/profile",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData(data.organization);
      console.log("Organization Data:", data.organization);
    } catch (error) {
      console.error("Error fetching organization profile:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("orgToken");
        navigate("/login/organaization");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("orgToken");
    navigate("/login/organaization");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-blue-600">
            {t("organization.panel")}
          </h1>
          <span className="text-slate-600">|</span>
          <span className="text-slate-700">
            {data?.name || t("organization.dashboard")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button
            icon="pi pi-sign-out"
            label={t("organization.logout")}
            className="p-button-text p-button-danger"
            onClick={handleLogout}
          />
          <Tooltip target=".profile" position="bottom" />
          <Avatar
            data-pr-tooltip={data?.name || "Organization"}
            icon="pi pi-building"
            className="bg-blue-600 text-white profile cursor-pointer"
            shape="circle"
            image={data?.profile_image_url}
            alt="Organization Image"
            width="50"
            height="50"
          />
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
