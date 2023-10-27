import { useMemo, useState } from 'react'
import './main.css';
import { Input } from '../../components/Input';
import { fetchDB } from '../../helpers/fetchAPI';
import { useQuery } from '@tanstack/react-query';
import { dateDayName, dateFormat } from '../../helpers/dateDB';
import { buildSlots } from '../../helpers/buildSlots';
import { Button } from '../../components/Button';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import { Tiles, TilesMulti } from '../../components/Tiles';
import { Customer } from '../../components/Customer';
import { useDbSched } from '../../hooks/useDbSched';
import { uniqueBarCode } from '../../helpers/barCode';




export function Main() {
  const [zip, setZip] = useState('')
  const [sched, setSched] = useState('')
  const [understood, setUnderstood] = useState(false)
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState(false)
  const [donationList, setDonationList] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [googlePlace, setGooglePlace] = useState<IPlace>({})
  const [isEdit, setIsEdit] = useState<IEdit>()

  const [appt, setAppt] = useState<IAppt>({ id:'', items: '', apt: '', note: '', slot: '1', rt: 'Unassigned', time: '9AM', cell: '' })

  // const dbSched = useQuery<any>({ queryKey: ['schedule', 'Schedule'], queryFn: fetchDB, staleTime: 1000 * 60 * 5 });
  const [dbSched, addNew, update] = useDbSched()

  const availSlots: any = useMemo(() => { console.log('useMemo'); return buildSlots(dbSched)[0] }, [dbSched])

  const handleSubmit = (e: any) => {
    // Save the updated schedule, blank indicates that it is a Cancel
    console.log('Main handleSubmit', e, appt, phone)
    if (e !== '' && appt) {
      // in Edit mode the control variables will come from the db record, otherwise they are created
      let dbEntry: ISched = { id: setID(), name: name, phone: phone, zip: whichZip(zip), place: googlePlace, appt: e, dt: dateFormat(null), src: whichSrc('w') }
      // e = { ...e, name: name, _id: schedDate, zip: zip, place: addr, phone: phone, src: 'm' }
      // console.log(e)

      addNew({ _id: sched, c: [dbEntry] }, dbSched)
      if (googlePlace.zip !== zip) alert('Google Address zip mismatch')
      alert('pretending to submit, will add customer to Shopify')

    }
    setSaved(true)
    setSched('')
    setName('')
    setPhone('')
    setGooglePlace({ addr: '', lat: '', lng: '', zip: '' })
    setAppt({ id: '', items: '', apt: '', note: '', slot: '1', rt: 'u', time: '', cell: '' })
    setZip('')
    setIsEdit({})
    // setShowForm(false)

    function setID() {
      const theId = isEdit && isEdit.hasOwnProperty('id') ? isEdit.id : uniqueBarCode()
      return theId ? theId : ''
    }
    function whichZip(z: any) {
      const theId = isEdit && isEdit.hasOwnProperty('zip') ? isEdit.zip : z
      return theId ? theId : ''
    }
    function whichSrc(z: any) {
      const theId = isEdit && isEdit.hasOwnProperty('src') ? isEdit.src : z
      return theId ? theId : ''
    }
  }
function handlePhoneLookup() {
  console.log('handlePhoneLookup')
}
  return (
    <>
      {!dbSched ? <div>Loading...</div> :
        <>
          <BreadCrumbs crumbs={[zip, sched, '']} />
          <ZipList isOpen={availSlots && !sched} availSlots={availSlots} zip={zip} setSched={(e: string) => setSched(e)} setZip={(e: string) => setZip(e)} />
          <NotAccepted isOpen={sched !== '' && !understood} setUnderstood={(e: boolean) => setUnderstood(e)} />
          <Donations isOpen={understood && !done} donations={donationList} setDonations={(e: any) => setDonationList(e)} setDone={() => setDone(true)} />
          <Customer
              schedDate={sched}
              isOpen={done && !saved}
              name={name}
              phone={phone}
              place={googlePlace}
              setPlace={(e: any) => setGooglePlace(e)}
              appt={appt}
              setAppt={(e: any) => setAppt(e)}
              setSchedDate={(e: any) => setSched(e)}
              handlePhoneLookup={() => handlePhoneLookup()}
              setName={(e: any) => setName(e)}
              setPhone={(e: any) => setPhone(e)}
              setAddr={(e: any) => setAppt(e)}
              handleSubmit={(e: any) => handleSubmit(e)}
            />
            {saved && <div>Saved!</div>}
        </>
      }
    </>
  )
}

function BreadCrumbs({ crumbs }: any) {
  return (
    <div className='breadcrumb'>
      {`${crumbs[0]} / ${crumbs[1]} / ${crumbs[2]}`}
    </div>
  )
}

interface IZip {
  isOpen: boolean
  availSlots: any
  zip: string
  setSched: Function
  setZip: Function
}
function ZipList({ isOpen, availSlots, zip, setSched, setZip }: IZip) {
  const zipOpen = () => {
    return zip.length === 5
  }
  const zipFound = () => {
    console.log(zipOpen(), availSlots)
    return zipOpen() && availSlots && availSlots.hasOwnProperty(zip)
  }
  return (<>
    {isOpen && availSlots &&
      <>
        <Input type={'text'} value={zip} title={'Zip Code'} onChange={(e: string) => setZip(e)} />
        <div className={`${zipOpen() && 'zipopen'} zipmenu`}>
          <div className='ziplist'>
            {zipOpen() && (zipFound() ? 'Available Pickup Dates:' : 'Not in our Service Area')}
            {zipOpen() && zipFound() &&
              availSlots[zip].map((availSlot: any, key: number) => (
                <button key={key} onClick={() => setSched(`${availSlot.d}`)}>{dateDayName(availSlot.d)} {availSlot.d} - {availSlot.u}/{availSlot.t}</button>
              ))
            }
          </div>
        </div>
      </>
    }
  </>
  )

}

interface INotAcc {
  isOpen: boolean
  setUnderstood: Function
}
function NotAccepted({ isOpen, setUnderstood }: INotAcc) {
  return (
    <>
      {isOpen &&
        <>
          <h4>We do not accept:</h4>
          <div className='notacceptlist'>
            <div>Hospital beds</div>
            <div>Sleep # beds</div>
            <div>Linens</div>
            <div>Clothing</div>
            <div>Unframed mirror or glass</div>
            <div>Vertical blinds</div>
            <div>Shower doors</div>
            <div>Garge doors</div>
            <div>Wooden ladders</div>
            <div>Propane tanks</div>
            <div>Opened paint</div>
            <div>Chemicals</div>
            <div>Conference tables</div>
            <div>Electronics, Computers</div>
            <div>Faucets</div>
            <div>Youth/baby furniture, Toys</div>
            <div>Water heater, water softener</div>
            <div>Recess or Commercial lighting</div>
          </div>
          <Button onClick={() => setUnderstood(true)}>Understood</Button>
        </>
      }
    </>
  )
}

interface IDonate {
  isOpen: boolean
  donations: any
  setDonations: Function
  setDone: Function
}

function Donations({ isOpen, donations, setDonations, setDone }: IDonate) {

  function handleProducts(e: any, i: any, l: any) {
    if (!e) return
    let adjust = [...donations]
    let found = false
    console.log('handleProducts', donations, adjust, i)

    // Is this a custom product? If so just add it, otherwise check for other attributes.
    if (i > l.length - 1) {
      console.log('Custom')
      if (!adjust.find((x: any) => { return x.prod === e })) {
        adjust?.push({ prod: e, qty: 1 })
      }
      console.log(adjust)
    } else {
      adjust && adjust.length > 0 && adjust?.forEach((x: any) => {
        // console.log(x.prod, e)
        if (x.prod === e) { x.qty = x.qty + 1; found = true }
      })
      if (!found) { adjust?.push({ prod: e, qty: 1 }) }
    }
    // console.log(adjust)
    setDonations([...adjust])
  }

  function handleClear(e: any) {
    console.log('handleClear')
    setDonations([])
  }
  const products = { Bedroom: ['x', 'y', 'z'], 'Dining Room': ['a', 'b', 'c'] }

  return (
    <>
      {isOpen &&
        <>
          <Button onClick={(e: any) => handleClear(e)}>Reset</Button>
          <Button onClick={(e: any) => setDone(e)}>Save/Done</Button>

          <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
            <DonateType title='Bedroom:' hasCustom={'text'} chosen={donations} products={products.Bedroom} onClick={(e: any, i: any, l: any) => { handleProducts(e, i, l) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Dining Room:' hasCustom={'text'} chosen={donations} products={products['Dining Room']} onClick={(e: any, i: any, v: number) => { handleProducts(e, i, v) }} onClear={(e: any) => { handleClear(e) }} />
            {/* <DonateType title='Kitchen:' hasCustom={'text'} chosen={result.prods} products={getCategories(theRoom.prod.item)} onClick={(e: any, i: any, v: number) => { handleProducts(e, i, v) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Living Room:' hasCustom={'text'} chosen={result.prods} products={getCategories(theRoom.prod.item)} onClick={(e: any, i: any, v: number) => { handleProducts(e, i, v) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Kitchen:' hasCustom={'text'} chosen={result.prods} products={getCategories(theRoom.prod.item)} onClick={(e: any, i: any, v: number) => { handleProducts(e, i, v) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Patio:' hasCustom={'text'} chosen={result.prods} products={getCategories(theRoom.prod.item)} onClick={(e: any, i: any, v: number) => { handleProducts(e, i, v) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Other:' hasCustom={'text'} chosen={result.prods} products={getCategories(theRoom.prod.item)} onClick={(e: any, i: any, v: number) => { handleProducts(e, i, v) }} onClear={(e: any) => { handleClear(e) }} />
 */}
          </Accordion>

        </>}
    </>
  )
}

interface IType {
  products: string[]
  chosen: Iprods
  hasCustom: string
  title?: string
  onClick: Function
  onClear: Function
}
function DonateType({ products, title, chosen, hasCustom, onClick, onClear }: IType) {
  const handleClick = (e: string, id: number) => {
    console.log('DonateType', e, id)
    onClick(e, id, products)
  }
  const handleClear = (e: string) => {
    console.log('Products-handleClear')
    onClear(e)
  }
  console.log(chosen)
  return (
    <AccordionItem>
      <AccordionItemHeading>
        <AccordionItemButton>
          {title}
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        <TilesMulti tiles={products} selected={0} chosen={chosen} hasCustom={hasCustom} onClick={(e: any, i: any) => handleClick(e, i)} onClear={(e: any) => handleClear(e)} />
      </AccordionItemPanel>
    </AccordionItem>
  )

}
