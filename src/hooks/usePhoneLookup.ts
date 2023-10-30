import { useState } from "react";
import { shopifyCustSearch } from "../helpers/shopify";

export function usePhoneLookup() {
    const [theResult, setTheResult]:any = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const doPhoneLookup = async (phone: string) => {
        setIsLoading(true)
        const response = await shopifyCustSearch(phone)
        //result array[0] is array of Shopify customers (customers empty not found), array[1] is array (empty not found)
        setTheResult(response)
        setIsLoading(false)
    }
    return [theResult, doPhoneLookup, isLoading];
}
