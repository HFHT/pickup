import { useState } from "react";
import { shopifyCustAdd } from "../helpers/shopify";
import { fetchAPI } from "../helpers/fetchAPI";
import { dateFormat } from "../helpers/dateDB";

export function useCacnel() {

    const doCancelSave = async (reason: any) => {
        console.log(reason)

        fetchAPI({
            isObj: true,
            req: {
                method: 'insertOne', db: 'Truck',
                collection: 'Cancel',
                data: {
reason: reason,
                    dt: dateFormat(null)
                }
            }
        })
        //result array[0] is array of Shopify customers (customers empty not found), array[1] is array (empty not found)
    }
    return [doCancelSave];
}
