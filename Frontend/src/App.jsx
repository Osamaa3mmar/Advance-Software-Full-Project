import { PrimeReactProvider } from "primereact/api";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import LoginPage from "./Page/Auth/LoginPage";
import 'primeicons/primeicons.css';
import SignupPage from "./Page/Auth/SignupPage";
import { useContext } from "react";
import ToastContext from "./Context/Toast";
import { Toast } from "primereact/toast";
import { LanguageProvider } from "./Context/LanguageContext";
import ResetPassword from "./Page/Auth/ResetPassword";

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

      ],
    },{
      path:"/main",
      element:<div>Main App Here</div>,
      children:[{
        path:"home",
        element:<div>Home Page</div>

      }]
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
