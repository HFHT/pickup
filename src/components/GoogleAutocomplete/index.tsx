import { useAutocomplete } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';

interface IAddr {
    place: {
        addr: string
        lat: string
        lng: string
    };
    initValue?: string
    setPlace: Function;
    setHavePlace: Function;
}


export const Autocomplete = ({ place, initValue, setPlace, setHavePlace }: IAddr) => {
    const inputRef = useRef(null);

    const onPlaceChanged = (thisPlace: any) => {
        // if (place.defaultPrevented) return
        // place.preventDefault()
        console.log(place, thisPlace)
        const thePlace = { ...thisPlace };
        // place.stopPropagation()

        if (thePlace) {
            thePlace.address_components.map((comp: any) => {
                console.log(comp, comp.types[0] === 'postal_code')
                // comp.types.find((e:any)=>{e==='postal_code'})
            })
            // thePlace.address_components.find((comp:any) => comp.types[0]==='postal_code')
            setPlace(
                {
                    addr: (thePlace.formatted_address || thePlace.name),
                    lat: thePlace.geometry.location.lat(),
                    lng: thePlace.geometry.location.lng(),
                    zip: thePlace.address_components.find((comp: any) => comp.types[0] === 'postal_code').long_name
                });
            setHavePlace(true)
        }

        //@ts-ignore Keep focus on input element
        // inputRef.current && inputRef.current.focus();

    };

    useAutocomplete({
        inputField: inputRef && inputRef.current,
        onPlaceChanged
    });

    const handleInputChange = (event: any) => {
        setPlace({ addr: event.target.value, lat: '', lng: '' });
    };
    
    useEffect(() => {
        console.log(inputRef)
        console.log(initValue)
        if (inputRef && initValue) {
            console.log('ref and init')
             //@ts-ignore
            inputRef.current.value=initValue
        }
    }, [initValue])
    
    return (
        <div className='autodiv'>
            <label className='text-sm'>
                <input ref={inputRef} type='text' placeholder='Address' value={place.addr} onChange={handleInputChange} />
            </label >
        </div>
    );
};