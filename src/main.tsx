
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Import i18n before rendering the App
import './i18n/i18n';

createRoot(document.getElementById("root")!).render(<App />);
