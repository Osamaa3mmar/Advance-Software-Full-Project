import { PrimeReactProvider } from "primereact/api";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import LoginPage from "./Page/Auth/LoginPage";
import 'primeicons/primeicons.css';

export default function App() {
  const value = {
    ripple: true,
  };
  const router = createBrowserRouter([
    //auth
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "", element: <LoginPage/> },
        { path:"/login",element:<LoginPage/>},

      ],
    },
  ]);

  return (
    <PrimeReactProvider value={value}>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  );
}
