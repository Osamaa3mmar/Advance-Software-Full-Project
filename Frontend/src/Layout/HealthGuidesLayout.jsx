import { Outlet } from "react-router-dom";
import LanguageToggle from "../Components/LanguageToggle/LanguageToggle";

export default function HealthGuidesLayout() {
  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50">
      </div>
      <Outlet />
    </div>
  );
}
