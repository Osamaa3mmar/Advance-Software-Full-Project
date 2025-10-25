import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();

  // Fake donation data (amounts in thousands)
  const donationData = [
    { month: "Jan", amount: 3250, percentage: 65 },
    { month: "Feb", amount: 2950, percentage: 59 },
    { month: "Mar", amount: 4000, percentage: 80 },
    { month: "Apr", amount: 4050, percentage: 81 },
    { month: "May", amount: 2800, percentage: 56 },
    { month: "Jun", amount: 4250, percentage: 85 },
    { month: "Jul", amount: 3600, percentage: 72 },
  ];

  const stats = [
    {
      title: t("admin.stats.totalUsers"),
      value: "1,234",
      icon: "pi pi-users",
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: t("admin.stats.healthGuides"),
      value: "89",
      icon: "pi pi-book",
      color: "bg-green-500",
      change: "+5%",
    },
    {
      title: t("admin.stats.activeAlerts"),
      value: "23",
      icon: "pi pi-bell",
      color: "bg-orange-500",
      change: "-3%",
    },
    {
      title: t("admin.stats.organizations"),
      value: "45",
      icon: "pi pi-building",
      color: "bg-purple-500",
      change: "+8%",
    },
  ];

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
                  {stat.value}
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
          title={t("admin.charts.donations")}
          className="shadow-sm border border-slate-200"
        >
          <div className="h-[300px] flex flex-col">
            <div className="flex-1 flex items-end gap-2 px-4">
              {donationData.map((data, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  title={`$${data.amount.toLocaleString()}`}
                >
                  <div className="relative w-full">
                    <div
                      className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all hover:from-green-700 hover:to-green-500"
                      style={{ height: `${(data.percentage / 100) * 250}px` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      ${data.amount.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 px-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Donations:</span>
                <span className="font-bold text-green-600">
                  ${donationData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
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

      {/* Quick Actions */}
      <Card
        title={t("admin.quickActions.title")}
        className="shadow-sm border border-slate-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </div>
  );
}
