import { Card } from "primereact/card";
import { useContext, useEffect, useState } from "react";
import {  useTranslation } from "react-i18next";
import ToastContext from "../../Context/Toast";
import { ProgressSpinner } from 'primereact/progressspinner';

import axios from "axios";
export default function DashboardPage() {
  const { t } = useTranslation();
  const {toast}=useContext(ToastContext);
    const [loading,setLoading]=useState(false);
    const [data,setData]=useState(null);
    const [error,setError]=useState(null);
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
  const getData=async()=>{
    try{
        
        setLoading(true);
        await delay(1000);
        const {data}=await axios.get("http://localhost:5555/api/admin/info",{
            headers:{
                Authorization:localStorage.getItem("token")
            }
        });
        setData(data.data);
    }catch(error){
        setError(error);
        console.log(error);
        toast.current.show({
            severity: "error",
            summary: "Error while fetching data",
            detail: error.message,
            life: 3000,
          });
    }finally{
        setLoading(false);
    }
  }
  useEffect(()=>{
    getData();
  },[])
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
          <Card key={index} className="shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">
                    {loading?
                <ProgressSpinner style={{width: '40px', height: '40px'}}   animationDuration=".5s" />
                    :
                   stat.value
                   }
                  {}

                </h3>
              </div>
              <div
                className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}
              >
                <i className={`${stat.icon} text-white text-2xl`}></i>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
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
            <button className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
              <i className="pi pi-building text-2xl text-slate-400 group-hover:text-purple-500 mb-2"></i>
              <p className="font-medium text-slate-700 group-hover:text-purple-600">
                {t("admin.quickActions.addOrg")}
              </p>
            </button>
          </div>
        </Card>

        <Card
          title={t("admin.recentActivity.title")}
          className="shadow-sm border border-slate-200"
        >
          <div className="space-y-4">
            {[
              {
                text: t("admin.recentActivity.newOrg"),
                time: "2 " + t("admin.recentActivity.hoursAgo"),
                icon: "pi-building",
              },
              {
                text: t("admin.recentActivity.guidePublished"),
                time: "5 " + t("admin.recentActivity.hoursAgo"),
                icon: "pi-book",
              },
              {
                text: t("admin.recentActivity.alertTriggered"),
                time: "1 " + t("admin.recentActivity.dayAgo"),
                icon: "pi-bell",
              },
              {
                text: t("admin.recentActivity.userCreated"),
                time: "2 " + t("admin.recentActivity.daysAgo"),
                icon: "pi-user",
              },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <i className={`pi ${activity.icon} text-slate-600`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.text}
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
