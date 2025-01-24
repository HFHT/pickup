// performs a request and resolves with JSON
export const fetchJson = async (url: any, init = {}) => {
    // console.log(url, init)
    const res = await fetch(url, init);
    if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
};

// get JSON from multiple URLs and pass to setters
export const fetchAndSetAll = async (collection: any, isGpt: boolean = false) => {
    // fetch all data first
    const allData = await Promise.all(
        //   collection.map(({ url, init }:any) => console.log(url, init))
        collection.map(({ url, init }: any) => fetchJson(url, init))
    );
    // console.log(allData)
    // iterate setters and pass in data
    collection.forEach(({ setter }: any, i: any) => {
        setter(choose(isGpt, allData[i]));
    });

    function choose(b: boolean, g: any) {
        let initVal = [{ qty: 0, prod: '', category: '' }]
        console.log('ChatGPT-fetchJson', g)
        if (g.choices.length === 0) return [...initVal]
        try {
            let retObj = g.choices[0].message.content
            if (retObj) {
                let retVal = JSON.parse(retObj)
                if (retVal && retVal.products) return retVal.products
            }
        } catch (e) {
            console.log(g)
            console.log(e)
        }
        return [...initVal]
    }
};

export function truncateString(str: string, match: string): string {
    const parts = str.split(match);
    return parts.length > 1 ? parts[0] : str;
}