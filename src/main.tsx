
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure environment variables are loaded
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables!');
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
      <h1>Environment Configuration Error</h1>
      <p>Missing required Supabase environment variables.</p>
      <p>Please make sure your environment variables are correctly set.</p>
    </div>
  `;
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
