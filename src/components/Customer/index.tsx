import { useEffect, useState } from "react"
import { Input } from "../Input";
import { Autocomplete } from "../GoogleAutocomplete";
import { CONST_ROUTES, CONST_TIMES } from "../../constants";

export function Customer({ schedDate, isOpen, name, phone, place, setPlace, appt, setAppt, setSchedDate, handlePhoneLookup, setName, setPhone, setAddr, handleSubmit }: any) {

  const clearAppt: IAppt = { id: '', items: '', apt: '', note: '', slot: '1', rt: 'Unassigned', time: '9AM', cell: '' }

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
    !appt && setAppt(clearAppt)
  }, [])


  return (
    <>
      {isOpen &&
        <div className='pickupgrid'>
          {/* <div className='pickupgrid'> */}

          <div className='PU1 pickupinfo'>
            <h4>Pickup information:{schedDate}</h4>
            <Input type='date' value={schedDate} onChange={(e: string) => setSchedDate(e)} title='Date' />
            <div className='pickphone'>
              <Input type='text' value={phone} onChange={(e: string) => setPhone(e)} title='Phone' />
              <button className='tile text-sm buttonoutlined buttonfull buttonmiddle' onClick={() => handlePhoneLookup()}>Lookup</button>

            </div>
            Client Information:
            <Input type='text' value={name} onChange={(e: string) => setName(e)} title='Name' />
            {(!false) && <Autocomplete place={place.hasOwnProperty('addr') ? place.addr : ''} initValue={place.addr} setPlace={(e: any) => handleSetPlace(e)} setHavePlace={(e: any) => console.log(e)} />}
            <Input type='text' value={appt.apt} onChange={(e: string) => setAppt({ ...appt, apt: e })} title='Apartment' />
            <Input type='text' value={appt.note} onChange={(e: string) => setAppt({ ...appt, note: e })} title='Notes...' />
          </div>
          <div className='PU2 pickupitems'>
            <h4>Donation Information</h4>
            <div>
              <Input type='text' value={appt.items} onChange={(e: string) => setAppt({ ...appt, items: e })} spellCheck={true} title='List of donation items, seperate using comma' />
            </div>
            <button className='tile text-sm buttonoutlined buttonfull buttonmiddle' onClick={() => doClear()}>Cancel</button>
            <button className='tile text-sm buttonoutlined buttonfull buttonmiddle' onClick={() => doSubmit()}>Save</button>

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