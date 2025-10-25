import { Button } from "primereact/button";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      path: "/admin/dashboard",
    },
    {
      label: "Health Guides",
      icon: "pi pi-book",
      path: "/admin/health-guides",
    },
    {
      label: "Alerts",
      icon: "pi pi-bell",
      path: "/admin/alerts",
    },
    {
      label: "Organizations",
      icon: "pi pi-building",
      path: "/admin/organizations",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-200 z-50 flex flex-col shadow-lg"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white">
              A
            </div>
            <span className="font-semibold text-lg text-slate-800">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            onClick={handleLogout}
            className="w-full justify-center"
            severity="danger"
          />
        </div>
      </motion.aside>
    </>
  );
}
