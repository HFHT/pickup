import { useEffect, useState } from "react";
import { shopifyCustSearch } from "../helpers/shopify";
import { useGeocodingService } from "@vis.gl/react-google-maps";

export function usePhoneLookup() {
    const [theResult, setTheResult]: any = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [done, setDone] = useState(false)
    const geocoder = useGeocodingService();

    const doPhoneLookup = async (phone: string) => {
        setIsLoading(true)
        const response = await shopifyCustSearch(phone)
        //result array[0] is array of Shopify customers (customers empty not found), array[1] is array (empty not found)
        console.log(response)
        if (response && response[0] && (response[0].addr.lat === 0)) {
            let location = null
            if (geocoder) {
                location = await geocoder.geocode({ address: `${response[0].addr.addr}, ${response[0].addr.city}, ${response[0].addr.state},${response[0].addr.c_cd} ` }, function (result, status) {
                    console.log(result, status)
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(result)
                        return result
                    } else {
                        console.log('Geocode was not successful for the following reason: ', status)
                        return null
                    }
                })
            }
            console.log(response, location)
            if (location) {
                console.log('doPhoneLookup-using-geocode')
                response[0].addr.lat = location.results[0].geometry.location.lat()
                response[0].addr.lng = location.results[0].geometry.location.lng()
                response[0].addr.addr = location.results[0].formatted_address
            }
        }
        setTheResult(response)
        setIsLoading(false)
        setDone(true)
    }

    return [theResult, doPhoneLookup, isLoading, done, location];

}
