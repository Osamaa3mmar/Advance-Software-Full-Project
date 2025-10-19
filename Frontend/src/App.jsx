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

      ],
    },
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
