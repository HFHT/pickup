export const getLocalStorage = (key: any) => {
    try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key)
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : false
    } catch (error) {
        // If error also return initialValue
        console.log(error)
        return false
    }
}

export const setLocalStorage = (key: any, items: any) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(items));
    } else {
        alert('Local Storage not supported in your browser!')
    }
}