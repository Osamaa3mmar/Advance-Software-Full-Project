import { createContext, useRef } from "react";





const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
