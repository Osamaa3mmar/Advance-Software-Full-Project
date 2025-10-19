import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { ToastProvider } from './Context/Toast.jsx';

createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <App />
  </ToastProvider>,
)
