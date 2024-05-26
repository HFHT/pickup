import { useEffect, useState } from "react";

export function useParams(paramList: string[]): any {
    const [params, setParams] = useState<any>([])

    useEffect(() => {
        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);
        let retParms: any = {}
        paramList.forEach((p: string) => retParms[p] = (params.get(p) !== null))
        setParams(retParms)
    }, [])

    return params;
}