
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Check if required environment variables are available
const isMissingEnvVars = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the root
const root = createRoot(rootElement);

// Render the app or an error message
if (isMissingEnvVars) {
  console.error('Missing required Supabase environment variables!');
  root.render(
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-gray-800">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Configuration Error</h1>
        <p>The application is missing required environment variables for Supabase.</p>
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="font-semibold">Please set the following environment variables:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_ANON_KEY</li>
          </ul>
        </div>
        <p className="text-sm">
          The application will run with limited functionality without these variables.
        </p>
      </div>
    </div>
  );
} else {
  root.render(<App />);
}
