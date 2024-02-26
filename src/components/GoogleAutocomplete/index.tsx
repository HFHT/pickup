import { useAutocomplete } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';
import { useGeoCode } from '../../hooks/useGeoCode';

interface IAddr {
    place: IPlace;
    initValue?: string
    setPlace: Function;
    setHavePlace: Function;
}

export const Autocomplete = ({ place, initValue, setPlace, setHavePlace }: IAddr) => {
    const inputRef = useRef(null);
    const [theAddress, doAddressLookup, isLookupLoading, lookupDone] = useGeoCode()

    const onPlaceChanged = (thisPlace: any) => {
        console.log(place, thisPlace)
        const thePlace = { ...thisPlace }

        if (thePlace) {
            setPlace(
                {
                    addr: (thePlace.formatted_address || thePlace.name),
                    lat: thePlace.geometry.location.lat(),
                    lng: thePlace.geometry.location.lng(),
                    num: getComponent(thePlace, 'street_number').long_name,
                    route: getComponent(thePlace, 'route').long_name,
                    city: getComponent(thePlace, 'locality').long_name,
                    state: getComponent(thePlace, 'administrative_area_level_1').long_name,
                    c_cd: getComponent(thePlace, 'country').short_name,
                    c_nm: getComponent(thePlace, 'country').long_name,
                    zip: getComponent(thePlace, 'postal_code').long_name
                });
            setHavePlace(true)
        }
    };

    useAutocomplete({
        inputField: inputRef && inputRef.current,
        onPlaceChanged
    });

    const handleInputChange = (event: any) => {
        setPlace({ addr: event.target.value, lat: '', lng: '' });
    };
    const handleBlur = (event: any) => {
        console.log('handleBlur', event.target.value, place)
        doAddressLookup(event.target.value)
    };
    useEffect(() => {
        console.log(theAddress)
        if (!theAddress) return
        if (theAddress.partial_match) { console.log('partial match, ask for validation here!'); return }
        if (place.lat === '') { 
            console.log('place is not set') 
            setPlace(
                {
                    addr: (theAddress.formatted_address || theAddress.name),
                    lat: theAddress.geometry.location.lat(),
                    lng: theAddress.geometry.location.lng(),
                    num: getComponent(theAddress, 'street_number').long_name,
                    route: getComponent(theAddress, 'route').long_name,
                    city: getComponent(theAddress, 'locality').long_name,
                    state: getComponent(theAddress, 'administrative_area_level_1').long_name,
                    c_cd: getComponent(theAddress, 'country').short_name,
                    c_nm: getComponent(theAddress, 'country').long_name,
                    zip: getComponent(theAddress, 'postal_code').long_name
                });
            setHavePlace(true)
        
        }
    }, [theAddress])

    useEffect(() => {
        console.log(inputRef)
        console.log(initValue)
        if (inputRef && initValue) {
            console.log('ref and init')
            //@ts-ignore
            inputRef.current.value = initValue
        }
    }, [initValue])

    return (
        <div className='autodiv addrdiv'>
            <label className='text-sm'>
                <input ref={inputRef} type='text' placeholder='Address' value={place.addr} onChange={handleInputChange} onBlur={handleBlur} />
            </label >
        </div>
    );
};

function getComponent(place: any, type: string) {
    const tc = place.address_components.find((comp: any) => comp.types[0] === type)
    console.log(tc)
    if (tc) return tc
    return { long_name: '', short_name: '' }
}