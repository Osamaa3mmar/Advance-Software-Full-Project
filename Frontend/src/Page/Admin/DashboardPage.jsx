import { Card } from "primereact/card";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: "pi pi-users",
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Health Guides",
      value: "89",
      icon: "pi pi-book",
      color: "bg-green-500",
      change: "+5%",
    },
    {
      title: "Active Alerts",
      value: "23",
      icon: "pi pi-bell",
      color: "bg-orange-500",
      change: "-3%",
    },
    {
      title: "Organizations",
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
          Dashboard Overview
        </h2>
        <p className="text-slate-600 mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
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
        <Card title="Donations" className="shadow-sm border border-slate-200">
          <div className="h-[300px] flex items-end gap-2 px-4">
            {[65, 59, 80, 81, 56, 85, 72].map((value, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all hover:from-green-700 hover:to-green-500"
                  style={{ height: `${value}%` }}
                ></div>
                <span className="text-xs text-slate-500">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][idx]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Recent Activity"
          className="shadow-sm border border-slate-200"
        >
          <div className="space-y-4">
            {[
              {
                text: "New organization registered",
                time: "2 hours ago",
                icon: "pi-building",
              },
              {
                text: "Health guide published",
                time: "5 hours ago",
                icon: "pi-book",
              },
              {
                text: "System alert triggered",
                time: "1 day ago",
                icon: "pi-bell",
              },
              {
                text: "User account created",
                time: "2 days ago",
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
      <Card title="Quick Actions" className="shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <i className="pi pi-plus text-2xl text-slate-400 group-hover:text-blue-500 mb-2"></i>
            <p className="font-medium text-slate-700 group-hover:text-blue-600">
              Add Health Guide
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
            <i className="pi pi-bell text-2xl text-slate-400 group-hover:text-green-500 mb-2"></i>
            <p className="font-medium text-slate-700 group-hover:text-green-600">
              Create Alert
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
            <i className="pi pi-building text-2xl text-slate-400 group-hover:text-purple-500 mb-2"></i>
            <p className="font-medium text-slate-700 group-hover:text-purple-600">
              Add Organization
            </p>
          </button>
        </div>
      </Card>
    </div>
  );
}
