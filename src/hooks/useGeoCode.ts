import { useGeocodingService } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';

export function useGeoCode() {
    const [theResult, setTheResult]: any = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [done, setDone] = useState(false)
    const geocoder = useGeocodingService();

    const doAddressLookup = async (addr: string) => {
        setIsLoading(true)
        //result array[0] is array of Shopify customers (customers empty not found), array[1] is array (empty not found)
        console.log(addr)
        var response: any = null
        if (addr) {
            let location = null
            if (geocoder) {
                location = await geocoder.geocode({ address: `${addr}` }, function (result, status) {
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
            console.log(addr, location)
            if (location) {
                //partial_match can be true or undefined
                console.log('doPhoneLookup-using-geocode', location, location.results[0].partial_match)
                response = location.results[0]
            }
        }
        setTheResult(response)
        setIsLoading(false)
        setDone(true)
    }

    return [theResult, doAddressLookup, isLoading, done, location];
}