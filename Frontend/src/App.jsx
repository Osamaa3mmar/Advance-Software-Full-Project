import { PrimeReactProvider } from "primereact/api";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import AdminLayout from "./Layout/AdminLayout";
import GroupLayout from "./Layout/GroupLayout";
import LoginPage from "./Page/Auth/LoginPage";
import "primeicons/primeicons.css";
import SignupPage from "./Page/Auth/SignupPage";
import { useContext } from "react";
import ToastContext from "./Context/Toast";
import { Toast } from "primereact/toast";
import { LanguageProvider } from "./Context/LanguageContext";
import ResetPassword from "./Page/Auth/ResetPassword";
import VerifyPage from "./Page/Auth/VerifyPage";
import OrganizationLogin from "./Page/Auth/OrganizationLogin";
import DashboardPage from "./Page/Admin/DashboardPage";
import OrganizationsPage from "./Page/Admin/OrganizationsPage";
import FilesPage from "./Page/Admin/FilesPage";
import RoomsLayout from "./Layout/RoomsLayout";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import RoomCheck from "./Page/Rooms/Room/RoomCheck";
import GroupsPage from "./Page/Groups/GroupsPage";
import ChatPage from "./Page/Groups/ChatPage";
import HealthGuidesLayout from "./Layout/HealthGuidesLayout";
import HealthGuidesPage from "./Page/HealthGuides/HealthGuidesPage";
import GroupPage from "./Page/Admin/Groups/GroupPage";
import HandleRequestPage from "./Page/Admin/Groups/HandleRequestPage.jsx";
import HealthGuidesCard from "./Components/HealthGuides/HealthGuidesCard.jsx";
import HealthGuidesMangePage from "./Page/Admin/HelathGuide/HealthGuidesMangePage.jsx";
export default function App() {
  const value = {
    ripple: true,
  };
  const { toast } = useContext(ToastContext);
  const agoraClient = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  ); // Initialize Agora Client

  const router = createBrowserRouter([
    //auth
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "", element: <LoginPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/signup", element: <SignupPage /> },
        { path: "/reset-password", element: <ResetPassword /> },
        { path: "/verify/:code", element: <VerifyPage /> },
        { path: "/login/organaization", element: <OrganizationLogin /> },
      ],
    },
    {
      path: "/org",
      element: <div>Organization App Here</div>,
      children: [
        {
          path: "dashboard",
          element: <div>Organization Dashboard</div>,
        },
        {},
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "",
          element: <DashboardPage />,
        },
        {
          path: "dashboard",
          element: <DashboardPage />,
        },
        {
          path: "health-guides",
          element:<HealthGuidesMangePage/>,
        },
        {
          path: "alerts",
          element: <div>Alerts Page - Coming Soon</div>,
        },
        {
          path: "organizations",
          element: <OrganizationsPage />,
        },
        {
          path: "files",
          element: <FilesPage />,
        },
       {
          path: "groups",
           element: <GroupPage />,
         },

           {
             path:"groups/:groupId/requests",
          element:<HandleRequestPage/>  
         },

        
      ],
    },
    
    {
      path: "/rooms",
      element: <RoomsLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={"/rooms/-9999"} />,
        },
        {
          path: ":id",
          element: (
            <AgoraRTCProvider client={agoraClient}>
              <RoomCheck />
            </AgoraRTCProvider>
          ),
        },
      ],
    },
    {
      path: "/main",
      element: <GroupLayout />,
      children: [
        { path: "groups", element: <GroupsPage /> },
        { path: "chat/:groupId", element: <ChatPage /> },
      ],
    },{
      path:"/test",
      element:<HealthGuidesLayout/>,
      children:[
      { path: "helthGuides", element: <HealthGuidesPage /> }
      ]
    }
  ]);

  return (
    <PrimeReactProvider value={value}>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toast ref={toast} />
      </LanguageProvider>
    </PrimeReactProvider>
  );
}
