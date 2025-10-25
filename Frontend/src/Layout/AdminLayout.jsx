import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import Sidebar from "../Components/Sidebar/Sidebar";
import LanguageToggle from "../Components/LanguageToggle/LanguageToggle";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div
        className="min-h-screen transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? "280px" : "0",
        }}
      >
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              icon={sidebarOpen ? "pi pi-times" : "pi pi-bars"}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-button-text p-button-rounded"
              aria-label="Toggle sidebar"
            />
            <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Avatar
              icon="pi pi-user"
              className="bg-blue-600 text-white"
              shape="circle"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
