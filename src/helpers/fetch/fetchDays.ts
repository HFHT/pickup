import { fetchJson } from ".";

export async function fetchDays(days: string[]) {
    const fetchSchedule = { url: `${import.meta.env.VITE_MONGO_URL}?req=${encodeURIComponent(JSON.stringify({ method: 'find', db: 'Truck', collection: 'Schedule', find: { _id: days[0] } }))}`, init: { method: 'GET', headers: new Headers } }

    let response = undefined
    try {
        response = await fetchJson(fetchSchedule.url, fetchSchedule.init)
    }
    catch (e: any) {
        console.log('useRefresh-catch', e.message, e)
    }
    finally {

    }

    // console.log(response)
    return response
};