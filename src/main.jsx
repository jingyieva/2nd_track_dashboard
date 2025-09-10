// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/styles/index.css'

if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser');
    await worker.start({
        serviceWorker: {
            // url: '/mockServiceWorker.js',
            url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        },
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)