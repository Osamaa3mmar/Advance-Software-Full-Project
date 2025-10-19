import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import "primereact/resources/themes/lara-light-cyan/theme.css";

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
