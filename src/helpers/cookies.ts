export function getCookie(key: string) {
    return document.cookie.split("; ").reduce((total, currentCookie) => {
        const item = currentCookie.split("=");
        const storedKey = item[0];
        const storedValue = item[1];
        return key === storedKey
            ? decodeURIComponent(storedValue)
            : total;
    }, '');
}

export function setCookie(key: string, value: any, numberOfDays: number) {
    const now = new Date();
    // set the time to be now + numberOfDays
    now.setTime(now.getTime() + (numberOfDays * 60 * 60 * 24 * 1000));
    console.log(key, value, now);
    document.cookie = `${key}=${value}; expires=${now.toUTCString()}; path=/`;
}