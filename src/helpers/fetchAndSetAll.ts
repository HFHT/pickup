// performs a request and resolves with JSON
export const fetchJson = async (url: any, init = {}) => {
    console.log(url, init)
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
    console.log(allData)
    // iterate setters and pass in data
    collection.forEach(({ setter }: any, i: any) => {
        setter(choose(isGpt, allData[i]));
    });

    function choose(b:boolean,g:any) {
        console.log(g)
        if (g.hasOwnProperty('choices')) {
            console.log(g.choices[0].text)
            return g.choices[0].text.replace(/[\r\n|\n]+/gm, '').replace(/[\"]/gm,'')
        }
        return g
    }
};