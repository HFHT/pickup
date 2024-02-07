import { useEffect, useState } from "react";
import { shopifyCustAdd } from "../helpers/shopify";

export function useParams(paramList: string[]): any {
    const [params, setParams] = useState<any>([])


    useEffect(() => {
        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);
        let retParms: any = {}
        paramList.forEach((p: string) => retParms[p] = params.get(p))
        setParams(retParms)
    }, [])

    return params;
}