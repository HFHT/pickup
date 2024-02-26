import { useEffect, useState } from "react"
import { Autocomplete } from "../GoogleAutocomplete";
import PhoneInput from "react-phone-input-2";
import { Button, Input } from "..";
import { nullOrUndefined } from "../../helpers";

interface ICust {
  id: string
  isOpen: boolean
  name: IName
  setName: Function
  phone: string
  setPhone: Function
  lookupDone: boolean
  place: IPlace
  setPlace: Function
  appt: IAppt
  setAppt: Function
  setEmail: Function
  email: string
  custInfo: { apt: string, note: string }
  setCustInfo: Function
  setHaveCustomer: Function
}

export function Customer({ id, isOpen, name, phone, email, setEmail, custInfo, setCustInfo, lookupDone, place, setPlace, appt, setAppt, setName, setPhone, setHaveCustomer }: ICust) {
  const [canSave, setCanSave] = useState(name.first && name.last && place && place.city && phone && email)
  const clearAppt: IAppt = { id: id, slot: '1', rt: 'Unassigned', time: '9AM', cell: '' }
  const isEmail = (email: string): any => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  const doSubmit = () => {
    console.log('doSubmit', appt)
    if (!appt) return
    if (place.lat === '' || place.lng === '') { alert('Check address, could not locate GPS coordinates.') }
    setHaveCustomer({ ...appt })
  }

  const doClear = () => {
    console.log('doClear.........', appt)
    if (!appt) return
    setHaveCustomer('')
    setAppt(clearAppt)
  }

  useEffect(() => {
    console.log('useEffect-setCanSave...........', email, name, place, phone)
    setCanSave(name.first && name.last && place && place.city && phone && email && isEmail(email))
  }, [name, place, email, phone])


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
                {(!false) && <Autocomplete place={place} initValue={place.addr} setPlace={(e: any) => setPlace(e)} setHavePlace={(e: any) => console.log(e)} />}
                <Input type='text' value={name.first} inputMode={'text'} minLength={1} onChange={(e: string) => setName({ ...name, first: e })} title='First Name' />
                <Input type='text' value={name.last} inputMode={'text'} minLength={3} onChange={(e: string) => setName({ ...name, last: e })} title='Last Name' />
                <Input type='text' value={nullOrUndefined(name.company)} setter={(e: string) => setName({ ...name, company: e })} title='Company' />
                <Input type='text' value={custInfo.apt} setter={(e: string) => setCustInfo({ ...custInfo, apt: e })} title='Unit / Apartment' />
                <Input type='text' value={custInfo.note} setter={(e: string) => setCustInfo({ ...custInfo, note: e })} title='Gate Code / Notes...' />
                <Input type='email' value={email} inputMode={'email'} onChange={(e: string) => setEmail(e)} title='Email address...' />
              </>
              :
              <div className='customerimage'><h2 className='ziptext'>Proceeds fund Habitat for Humanity Tucson in building affordable homes in Tucson & Southern Arizona.</h2></div>
            }
          </div>
        </div>
      }
    </>
  )

}