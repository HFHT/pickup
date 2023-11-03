import { useEffect, useState } from "react"
import { Input } from "../Input";

import { Autocomplete } from "../GoogleAutocomplete";
import { CONST_ROUTES, CONST_TIMES } from "../../constants";
import PhoneInput from "react-phone-input-2";
import { Button } from "../Button";

export function Customer({ schedDate, isOpen, name, phone, place, setPlace, appt, setAppt, setSchedDate, handlePhoneLookup, setName, setPhone, setAddr, handleSubmit }: any) {
  const [canSave, setCanSave] = useState(name.first && name.last && place && phone && appt.email)
  const clearAppt: IAppt = { id: '', items: '', apt: '', note: '', email: '', slot: '1', rt: 'Unassigned', time: '9AM', cell: '' }
  const isEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  const isPhone = (p: string) => p.length === 10
  const doSubmit = () => {
    console.log('doSubmit', appt)
    if (!appt) return
    if (place.lat === '' || place.lng === '') { alert('Check address, could not locate GPS coordinates.') }
    console.log(calcCell(appt.rt, appt.time))
    handleSubmit({ ...appt, cell: calcCell(appt.rt, appt.time) })
    setAppt(clearAppt)
  }

  const doClear = () => {
    console.log('doClear', appt)
    if (!appt) return
    handleSubmit('')
    setAppt(clearAppt)
  }

  useEffect(() => {
    console.log('useEffect', appt)
    setCanSave(name.first && name.last && place && phone && appt.email && isEmail(appt.email))
  }, [name, place, appt, phone])


  useEffect(() => {
    console.log('useEffect', appt)
    !appt && setAppt(clearAppt)
  }, [])


  return (
    <>
      {isOpen &&
        <div className='pickupgrid'>
          {/* <div className='pickupgrid'> */}
          <Button onClick={() => doClear()}>Cancel</Button>
          <Button disabled={!canSave} onClick={() => doSubmit()}>Save</Button>

          <div className='PU1 pickupinfo'>
            <h4>Pickup information:{schedDate}</h4>
            <Input type='date' value={schedDate} onChange={(e: string) => setSchedDate(e)} title='Date' />
            <div className='pickphone'>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={(e: any) => setPhone(e)}
              />
              {/* <Input type='text' value={phone} onChange={(e: string) => setPhone(e)} title='Phone' /> */}
              {/* <button className='tile text-sm buttonoutlined buttonfull buttonmiddle' onClick={() => handlePhoneLookup()}>Lookup</button> */}

            </div>
            Client Information:
            <Input type='text' value={name.first} onChange={(e: string) => setName({ ...name, first: e })} required title='First Name' />
            <Input type='text' value={name.last} onChange={(e: string) => setName({ ...name, last: e })} required title='Last Name' />

            {(!false) && <Autocomplete place={place.hasOwnProperty('addr') ? place.addr : ''} initValue={place.addr} setPlace={(e: any) => handleSetPlace(e)} setHavePlace={(e: any) => console.log(e)} />}
            <Input type='text' value={appt.apt} onChange={(e: string) => setAppt({ ...appt, apt: e })} title='Apartment' />
            <Input type='text' value={appt.note} onChange={(e: string) => setAppt({ ...appt, note: e })} title='Gate Code... Notes...' />
            <Input type='email' value={appt.email} inputMode={'email'} onChange={(e: string) => setAppt({ ...appt, email: e })} title='Email address...' />

          </div>
          <div className='PU2 pickupitems'>
            <h4>Donation Information</h4>
            <div>
              <Input type='text' value={appt.items} onChange={(e: string) => setAppt({ ...appt, items: e })} spellCheck={true} title='List of donation items, seperate using comma' />
            </div>
          </div>

          {/* </div> */}
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