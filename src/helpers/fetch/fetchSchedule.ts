export const fetchSchedule = { url: `${import.meta.env.VITE_MONGO_URL}?req=${encodeURIComponent(JSON.stringify({ method: 'find', db: 'Truck', collection: 'Schedule' }))}`, init: { method: 'GET', headers: new Headers } }