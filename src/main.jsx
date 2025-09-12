// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/styles/index.css'

async function cleanupMSWIfDisabled() {
  if (!import.meta.env.VITE_ENABLE_MSW && 'serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const r of regs) {
      if (r.active?.scriptURL.includes('mockServiceWorker.js')) {
        console.log('[MSW] unregister old worker');
        await r.unregister();
      }
    }
  }
}

async function enableMSWIfNeeded() {
    if (import.meta.env.VITE_ENABLE_MSW) {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
            serviceWorker: {
                url: '/mockServiceWorker.js',
                // url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
            },
        });
    }
}
cleanupMSWIfDisabled().then(() => {
    enableMSWIfNeeded().then(() => {
        ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        )
    });
})