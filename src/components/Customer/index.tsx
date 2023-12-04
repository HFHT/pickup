import { useEffect, useState } from "react"

import { Autocomplete } from "../GoogleAutocomplete";
import { CONST_ROUTES, CONST_TIMES } from "../../constants";
import PhoneInput from "react-phone-input-2";
import { Button } from "../Button";
import { Input } from "../Input";

export function Customer({ id, isOpen, name, phone, lookupDone, place, setPlace, appt, setAppt, setName, setPhone, setHaveCustomer }: any) {
  const [canSave, setCanSave] = useState(name.first && name.last && place && place.city && phone && appt.email)
  const clearAppt: IAppt = { id: id, apt: '', note: '', email: '', slot: '1', rt: 'Unassigned', time: '9AM', cell: '' }
  const isEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  const doSubmit = () => {
    console.log('doSubmit', appt)
    if (!appt) return
    if (place.lat === '' || place.lng === '') { alert('Check address, could not locate GPS coordinates.') }
    console.log(calcCell(appt.rt, appt.time))
    setHaveCustomer({ ...appt, cell: calcCell(appt.rt, appt.time) })
  }

  const doClear = () => {
    console.log('doClear.........', appt)
    if (!appt) return
    setHaveCustomer('')
    setAppt(clearAppt)
  }

  useEffect(() => {
    console.log('useEffect-setCanSave...........', appt)
    setCanSave(name.first && name.last && place && place.city && phone && appt.email && isEmail(appt.email))
  }, [name, place, appt, phone])


  useEffect(() => {
    console.log('useEffect......', appt)
    !appt && setAppt(clearAppt)
  }, [])


  return (
    <>
      {isOpen &&
        <div className='pickupgrid'>
          <Button onClick={() => doClear()}>Cancel</Button>
          <Button disabled={!canSave} onClick={() => doSubmit()}>Save</Button>
          <div className='PU1 pickupinfo'>
            {/* <h3>{`Date of Pickup: ${schedDate}`}</h3> */}
            {/* <Input type='date' value={schedDate} onChange={(e: string) => setSchedDate(e)} title='Date' /> */}
            <div className='pickphone'>
              <PhoneInput
                country={'us'}
                value={phone}
                inputClass='pickphoneinput'
                onChange={(e: any) => setPhone(e)}
              />
            </div>
            {lookupDone ?
              <>
                <h3>Contact information...</h3>
                {(!false) && <Autocomplete place={place.hasOwnProperty('addr') ? place.addr : ''} initValue={place.addr} setPlace={(e: any) => handleSetPlace(e)} setHavePlace={(e: any) => console.log(e)} />}

                <Input type='text' value={name.first} inputMode={'text'} minLength={1} onChange={(e: string) => setName({ ...name, first: e })} title='First Name' />
                <Input type='text' value={name.last} inputMode={'text'} minLength={3} onChange={(e: string) => setName({ ...name, last: e })} title='Last Name' />
                <Input type='text' value={appt.apt} onChange={(e: string) => setAppt({ ...appt, apt: e })} title='Unit / Apartment' />
                <Input type='text' value={appt.note} onChange={(e: string) => setAppt({ ...appt, note: e })} title='Gate Code / Notes...' />
                <Input type='email' value={appt.email} inputMode={'email'} onChange={(e: string) => setAppt({ ...appt, email: e })} title='Email address...' />
              </>
              :
              <div className='customerimage'><h2 className='ziptext'>Proceeds fund Habitat for Humanity Tucson in building affordable homes in Tucson & Southern Arizona.</h2></div>
            }
          </div>
        </div>
      }
    </>
  )

  function handleSetPlace(e: any) {
    console.log(place.addr)
    setPlace(e)
  }

  function calcCell(rt: string, ti: string) {
    return `R${(CONST_ROUTES.findIndex((e) => e === rt) + 1).toString()}${(CONST_TIMES.findIndex((e) => e === ti) + 1).toString()}`
  }

}