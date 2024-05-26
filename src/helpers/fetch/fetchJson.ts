// performs a request and resolves with JSON
export const fetchJson = async (url: string, init = {}) => {
    // console.log(url, init)
    const res = await fetch(url, init);
    if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
};