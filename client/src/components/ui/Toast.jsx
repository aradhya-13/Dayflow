/**
 * Toast — notification system using react-hot-toast.
 *
 * SETUP (already done in App.jsx):
 *   import { Toaster } from 'react-hot-toast';
 *   <Toaster position="top-right" />
 *
 * USAGE anywhere in your components:
 *   import toast from 'react-hot-toast';
 *
 *   toast.success('Leave approved!');
 *   toast.error('Something went wrong');
 *   toast('Saved successfully');   // neutral
 *
 * No component needed — just import toast and call it.
 * This file just exports a pre-configured Toaster to drop in App.jsx.
 */
import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          fontSize: '14px',
          borderRadius: '10px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        success: {
          iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' },
        },
        error: {
          iconTheme: { primary: '#dc2626', secondary: '#fef2f2' },
        },
      }}
    />
  );
}
