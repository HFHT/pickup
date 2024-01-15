import { useState } from "react";
import { shopifyCustAdd } from "../helpers/shopify";

export function usePhoneSave() {
    const [theResult, setTheResult]:any = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const doPhoneSave = async (customer: any, appt:ISched) => {
        setIsLoading(true)
        console.log(customer, appt)
        const response = await shopifyCustAdd(customer, appt)
        //result array[0] is array of Shopify customers (customers empty not found), array[1] is array (empty not found)
        setTheResult(response)
        setIsLoading(false)
    }
    return [theResult, doPhoneSave, isLoading];
}
