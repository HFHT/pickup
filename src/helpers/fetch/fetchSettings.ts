export const fetchSettings = { url: `${import.meta.env.VITE_MONGO_URL}?req=${encodeURIComponent(JSON.stringify({ method: 'find', db: 'Truck', collection: 'Settings' }))}`, init: { method: 'GET', headers: new Headers } }