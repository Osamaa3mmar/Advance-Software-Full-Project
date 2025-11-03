import { PrimeReactProvider } from "primereact/api";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import GroupLayout from "./Layout/GroupLayout";
import LoginPage from "./Page/Auth/LoginPage";
import 'primeicons/primeicons.css';
import SignupPage from "./Page/Auth/SignupPage";
import { useContext } from "react";
import ToastContext from "./Context/Toast";
import { Toast } from "primereact/toast";
import { LanguageProvider } from "./Context/LanguageContext";
import ResetPassword from "./Page/Auth/ResetPassword";
import VerifyPage from "./Page/Auth/VerifyPage";
import OrganizationLogin from "./Page/Auth/OrganizationLogin";
import OrganizationLogin2 from "./Page/Auth/OrganizationLogin2";
import GroupsPage from "./Page/Groups/GroupsPage";
import ChatPage from "./Page/Groups/ChatPage";
import HealthGuidesLayout from './Layout/HealthGuidesLayout';
import HealthGuidesPage from "./Page/HealthGuides/HealthGuidesPage";

export default function App() {
  const value = {
    ripple: true,
  };
    const { toast } = useContext(ToastContext);

  const router = createBrowserRouter([
    //auth
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "", element: <LoginPage/> },
        { path:"/login",element:<LoginPage/>},
        { path:"/signup",element:<SignupPage/>},
        { path:"/reset-password",element:<ResetPassword/>},
        { path:"/verify/:code",element:<VerifyPage/>},
        { path:"/login/organaization",element:<OrganizationLogin/>},
        { path:"/login/organaization/:email",element:<OrganizationLogin2/>},

      ],
    },{
      path:"/main",
      element:<GroupLayout />,
      children:[{   path:"groups",   element:<GroupsPage/> },
                {   path:"chat/:groupId",   element:<ChatPage/> }

      ]},
      {
     path:"/main",
     element:<HealthGuidesLayout/>,
      children:[{   path:"helthGuides",   element:<HealthGuidesPage/> },]

      }
  ]);

  return (
    <PrimeReactProvider value={value}>
      <LanguageProvider>  
      <RouterProvider router={router} />
      <Toast ref={toast}/>
    </LanguageProvider>
    </PrimeReactProvider>
  );
}
