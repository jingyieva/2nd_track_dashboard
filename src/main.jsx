// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/styles/index.css'


async function enableMSWIfNeeded() {
    if (import.meta.env.VITE_ENABLE_MSW) {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
            serviceWorker: {
                // url: '/mockServiceWorker.js',
                url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
            },
            onUnhandledRequest: "bypass",
        });
    }
}

enableMSWIfNeeded().then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
});