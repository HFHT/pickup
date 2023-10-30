import { useEffect, useMemo, useState } from 'react'
import './main.css';
import { Input } from '../../components/Input';
import { dateDayName, dateFormat } from '../../helpers/dateDB';
import { buildSlots } from '../../helpers/buildSlots';
import { Button } from '../../components/Button';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import { TilesMulti } from '../../components/Tiles';
import { Customer } from '../../components/Customer';
import { useDbSched } from '../../hooks/useDbSched';
import { uniqueBarCode } from '../../helpers/barCode';
import { usePhoneLookup } from '../../hooks/usePhoneLookup';
import { usePhoneSave } from '../../hooks/usePhoneSave';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { CONST_ROUTE_MAX } from '../../constants';



export function Main() {
  const [zip, setZip] = useState('')
  const [sched, setSched] = useState('')
  const [understood, setUnderstood] = useState(false)
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [donationList, setDonationList] = useState([])
  const [name, setName] = useState({ first: '', last: '' })
  const [phone, setPhone] = useState('')
  const [googlePlace, setGooglePlace] = useState<IPlace>({})
  const [isEdit, setIsEdit] = useState<IEdit>()

  const [appt, setAppt] = useState<IAppt>({ id: '', items: '', apt: '', note: '', email: '', slot: '1', rt: 'Unassigned', time: '9AM', cell: '' })
  const [customer, doPhoneLookup, isLookupLoading] = usePhoneLookup()
  const [customer1, doPhoneSave, isSaving] = usePhoneSave()

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
      doPhoneSave(customer, dbEntry)
      if (googlePlace.zip !== zip) alert('Google Address zip mismatch')
      alert('pretending to submit, will add customer to Shopify')
      setSaved(true)

    } else {
      setCancelled(true)
    }
    setSched('')
    setName({ first: '', last: '' })
    setPhone('')
    setGooglePlace({ addr: '', lat: '', lng: '', zip: '' })
    setAppt({ id: '', items: '', apt: '', note: '', email: '', slot: '1', rt: 'u', time: '', cell: '' })
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
    // 
    doPhoneLookup(phone)
  }
  function handlePhone(p: string) {
    if (p.length === 11) {
      console.log('got phone', p)
      doPhoneLookup(p)
    }
    setPhone(p)
  }
  function handleCancel(e: any) {

  }
  useEffect(() => {
    if (!customer || customer.length < 2) return
    console.log(customer)
    if (customer[1].length > 0) {
      setName(customer[1][0].name)
      setGooglePlace(customer[1][0].addr)
      setAppt({ ...appt, email: customer[1][0].email, apt: customer[1][0].apt, note: customer[1][0].nt })
    }
  }, [customer])

  return (
    <>
      {!dbSched ? <div>Loading...</div> :
        <>
          <BreadCrumbs crumbs={[zip, sched, '']} />
          <ZipList isOpen={availSlots && !sched && !cancelled} availSlots={availSlots} zip={zip} setSched={(e: string) => setSched(e)} setZip={(e: string) => setZip(e)} />
          <NotAccepted isOpen={sched !== '' && !understood} setUnderstood={(e: boolean) => setUnderstood(e)} />
          <Donations isOpen={understood && !done} donations={donationList} setDonations={(e: any) => setDonationList(e)} setDone={() => setDone(true)} />
          <Customer
            schedDate={sched}
            isOpen={done && !saved && !cancelled}
            name={name}
            phone={phone}
            place={googlePlace}
            setPlace={(e: any) => setGooglePlace(e)}
            appt={appt}
            setAppt={(e: any) => setAppt(e)}
            setSchedDate={(e: any) => setSched(e)}
            handlePhoneLookup={() => handlePhoneLookup()}
            setName={(e: any) => setName(e)}
            setPhone={(e: any) => handlePhone(e)}
            setAddr={(e: any) => setAppt(e)}
            handleSubmit={(e: any) => handleSubmit(e)}
          />
          <Saved isOpen={saved} />
          <Cancelled isOpen={cancelled} onClick={(e: any) => handleCancel(e)} />
        </>
      }
    </>
  )
}

function Saved({ isOpen }: any) {
  return (
    <>
      {isOpen && <>
        <h3>Thank you for your donation. </h3>
        <blockquote>Proceeds generated from the HabiStore support Habitat Tucson's mission to build more affordable homes locally.</blockquote>
      </>}
    </>
  )
}

function Cancelled({ isOpen, onClick }: any) {
  return (
    <>
      {isOpen && <div className='canceldiv'>
        <h3>Thank you for thinking of us. </h3>
        <blockquote>Before you go could you let us know why you cancelled your donation?</blockquote>
        <textarea title='Reason' placeholder='Reason...' rows={4} cols={40} className='canceltext' spellCheck>
        </textarea>
        <Button onClick={(e: any) => onClick(e)}>Done</Button>
      </div>}
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
          {zipOpen() && (zipFound() ? 'Available Pickup Dates:' : 'Not in our Service Area')}

          <div className='ziplist'>
            {zipOpen() && zipFound() &&
              availSlots[zip].map((availSlot: any, key: number) => (
                <Button key={key} disabled={availSlot.t - availSlot.u < CONST_ROUTE_MAX} onClick={() => setSched(`${availSlot.d}`)}>{dateDayName(availSlot.d)} {availSlot.d} - {availSlot.u}/{availSlot.t}</Button>
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
          <h3>We do <u>not</u> accept:</h3>
          <div className='notacceptlist'>
            <div className='notacceptitem'>Hospital beds</div>
            <div className='notacceptitem'>Sleep # beds</div>
            <div className='notacceptitem'>Linens</div>
            <div className='notacceptitem'>Clothing</div>
            <div className='notacceptitem'>Unframed mirror or glass</div>
            <div className='notacceptitem'>Vertical blinds</div>
            <div className='notacceptitem'>Shower doors</div>
            <div className='notacceptitem'>Garge doors</div>
            <div className='notacceptitem'>Wooden ladders</div>
            <div className='notacceptitem'>Propane tanks</div>
            <div className='notacceptitem'>Opened paint</div>
            <div className='notacceptitem'>Chemicals</div>
            <div className='notacceptitem'>Conference tables</div>
            <div className='notacceptitem'>Electronics, Computers</div>
            <div className='notacceptitem'>Faucets</div>
            <div className='notacceptitem'>Youth/baby furniture, Toys</div>
            <div className='notacceptitem'>Water heater, water softener</div>
            <div className='notacceptitem'>Recess or Commercial lighting</div>
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

  const notify = (t: string) => {
    console.log(t);
    toast.info(t)
  }
  const notify1 = (t: string) => {
    console.log(t);
    toast.success(t, { autoClose: 7000 })
  }
  function handleProducts(e: any, i: any, l: any, t: string) {
    if (!e) return

    let adjust = [...donations]
    let found = false
    console.log('handleProducts', donations, adjust, i, t)
    if (donations.length === 0) {
      notify1("To add more of an item, press it's button again!")
    }
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
      if (!found) {
        adjust?.push({ prod: e, qty: 1 })
        if (t !== '') {
          notify(t);
        }
      }
    }
    // console.log(adjust)
    setDonations([...adjust])
  }

  function handleClear(e: any) {
    console.log('handleClear')
    setDonations([])
  }
  const msg = {
    pickup: 'Pick up only if included as part of larger donation.',
    solid: 'Solid wood construction only. No particle board.',
    appl: 'Appliances must be 10 years old or new, in full working order, and not missing parts or pieces.',
    rip: 'This item must be free of rips, stains, tears, excessive wear and pet hair.',
    working: 'Must be in good working condition.',
    mirror: 'Must have a frame. We do not accept unframed or plate glass mirrors.'
  }

  const products = {
    Bathroom: [
      { i: 'Accessories', t: msg.pickup },
      { i: 'Bathtub', t: 'Bath tubs steel or fiberglass-No Cast Iron Sinks or Bath tubs.' },
      { i: 'Sink', t: 'Removal of faucet preferred. No chips, spider veins or deep scratches in finish.' },
      { i: 'Toilet/Bidet', t: 'Toilets 1.6 gallon or less. ' + msg.working + ' ' + msg.pickup },
      { i: 'Cabinet', t: 'Bathroom vanities no water damage, will not take counter top without cabinet.' },
      { i: 'Mirror', t: msg.mirror },
      { i: 'Organizer', t: '' },
      { i: 'Shelving', t: '' },
      { i: 'Vanity', t: 'Bathroom vanities no water damage, will not take counter top without cabinet.' },
    ],
    Bedroom: [
      { i: 'Bed', t: 'We do not accept Hospital or Sleep Number beds. Must be disassembled for pick up.' },
      { i: 'Bed Frame', t: 'Must be disassembled for pick up.' },
      { i: 'Chest', t: msg.solid },
      { i: 'Dresser', t: 'Mirror should be detached from dresser for pickup.' },
      { i: 'Foundation', t: 'We do not accept Hospital or Sleep Number beds. Must be disassembled for pick up.' },
      { i: 'Head/Foot', t: 'Must be disassembled for pick up.' },
      { i: 'Mattress', t: '5 yrs or younger, must have original manufacturing tags attached, No rips, stains or tears.' },
      { i: 'Mirror', t: msg.mirror },
      { i: 'Nightstand', t: msg.solid },
      { i: 'Shelving', t: msg.solid },
      { i: 'Trundle Bed', t: 'Must be disassembled for pick up.' },
      { i: 'Wardrobe', t: msg.solid },
    ],
    'Dining Room': [
      { i: 'Bench', t: msg.solid },
      { i: 'Buffet', t: msg.solid },
      { i: 'Cart', t: msg.solid },
      { i: 'Chest', t: msg.solid },
      { i: 'China Cabinet', t: msg.solid },
      { i: 'Corner Cabinet', t: msg.solid },
      { i: 'Dining Table', t: msg.solid },
      { i: 'Dining Chair', t: msg.solid },
      { i: 'Liquor Cabinet', t: msg.solid },
      { i: 'Wine Rack', t: '' },
    ],
    'Kitchen': [
      { i: 'Accessories', t: msg.pickup },
      { i: 'Barstool', t: msg.rip },
      { i: 'Cabinet', t: 'Doors and drawers must be included.' },
      { i: 'Cooktop', t: msg.appl },
      { i: 'Countertop', t: 'Kitchen counter tops- no cut outs, straight pieces only.' },
      { i: 'Dishwasher', t: 'Dishwasher must be 5 years old or new, in full working order, and not missing parts or pieces. Must be disconnected.' },
      { i: 'Freezer', t: msg.appl },
      { i: 'Household', t: msg.appl },
      { i: 'Housewares', t: 'We accept glassware, pots, pans, art decor, figurines, etc. Pickup only as part of a larger donation.' },
      { i: 'Kitchen Chair', t: msg.rip },
      { i: 'Kitchen Table', t: msg.solid },
      { i: 'Kitchen Sink', t: 'Removal of faucet preferred. No chips, spider veins or deep scratches in finish.' },
      { i: 'Microwave', t: msg.appl },
      { i: 'Oven', t: msg.appl },
      { i: 'Range', t: msg.appl },
      { i: 'Range Hood', t: msg.appl },
      { i: 'Refigerator', t: msg.appl },
    ],
    'Laundry': [
      { i: 'Clothes Dryer', t: msg.appl + ' Must be disconnected from gas, electric and dryer vent.' },
      { i: 'Washing Machine', t: msg.appl + ' Must be disconnected.' },
      { i: 'Washer/Dryer Combo', t: msg.appl + ' Must be disconnected from gas, electric and dryer vent.' },

    ],
    'Living Room': [
      { i: 'Arm Chair', t: msg.rip },
      { i: 'Bean Bag', t: msg.rip },
      { i: 'Bookshelf', t: msg.solid },
      { i: 'Chair', t: msg.solid },

      { i: 'Coffee Table', t: msg.solid },
      { i: 'End Table', t: msg.solid },
      { i: 'Love Seat', t: '' },
      { i: 'Media Center', t: msg.solid },
      { i: 'Mirror', t: msg.mirror },

      { i: 'Ottoman', t: msg.rip },

      { i: 'Recliner', t: msg.rip },
      { i: 'Sectional', t: msg.rip },
      { i: 'Shelving', t: msg.solid },
      { i: 'Sleeper Sofa', t: 'In working condition. ' + msg.rip },

      { i: 'Sofa', t: msg.rip },
      { i: 'Sofa Table', t: msg.solid },
      { i: 'Storage', t: msg.solid },
      { i: 'TV Flat Screen', t: 'Flat screen TVs (5 yrs or younger). ' + msg.pickup },
      { i: 'TV Stand', t: msg.solid },
    ],
    'Office': [
      { i: 'Bookcase', t: msg.solid },
      { i: 'Credenza', t: msg.solid },
      { i: 'Desk', t: 'Desk must be 5 X 3 or smaller. ' + msg.solid },
      { i: 'File Cabinet', t: 'Metal or ' + msg.solid },
      { i: 'Office Chair', t: msg.rip },
      { i: 'Printer Stand', t: msg.solid },
    ],
    'Patio': [
      { i: 'Fencing', t: 'Fencing, must be a min of 10 ft, chicken wire min 25 ft.' },
      { i: 'Hammock', t: '' },
      { i: 'Landscape Tools', t: msg.pickup },
      { i: 'Outdoor Bed', t: '' },
      { i: 'Outdoor End Table', t: '' },
      { i: 'Outdoor Sofa', t: '' },
      { i: 'Storage Box', t: '' },
      { i: 'Patio Chair', t: '' },
      { i: 'Patio Table', t: '' },
      { i: 'Sunshade', t: '' },
      { i: 'Grill', t: 'Propane taniks not accepted.' + msg.appl },

    ],
    'Home Improvement': [
      { i: 'Area rug', t: 'Finished edges must be intact with no fraying.' },
      { i: 'Heating/Cooling', t: 'Gas or electric. Must be less than 15 years old. Must be removed properly and capped.' },
      { i: 'Blinds', t: 'Must be fully functioning and include all mounting hardware and accessories. We only accept vertical blinds that are brand new, in box.' },
      { i: 'Carpet', t: 'Carpet min 100 sq ft, no padding.' },
      { i: 'Fasteners / Hardware', t: 'Pick up only if included as part of larger donation.' },
      { i: 'Decking', t: 'Wood or composite. Must be in good condition with no rot, nails, or screws. Minimum of 100 sq ft for pickup.' },
      { i: 'Drywall', t: 'Full or half sheets only. No holes. Minimum of 5 full sheets for pickup.' },
      { i: 'Insulation', t: 'New only. Minimum of 4 full rolls for pickup.' },
      { i: 'Lumber', t: 'Unused lumber 8 ft or larger, no holes, no splitting or water damage.' },
      { i: 'Plywood', t: 'Must be at least 6 feet long and free of nails, screws and holes.' },
      { i: 'Trim/Molding', t: 'Must be at least 6 feet long and free of nails, screws and holes.' },
      { i: 'Tile', t: 'Ceramic, porcelain, marble, granite. New only. Must be full pieces ready to install. Minimum of 1 full box.' },
      { i: 'Flooring', t: 'Full pieces only. Minimum of 100 sq feet for pickup.' },
      { i: 'Sporting Goods', t: 'In working condition.' },
      { i: 'Housewares', t: '' },
      { i: 'Door', t: 'Must be not have any holes or deep scratches.' },
      { i: 'Sliding Glass Door', t: 'Sliding glass door w/ frame 48-72 X 80.' },
      { i: 'Lamp', t: 'Must include shade if applicable.' },

      { i: 'Light Fixture', t: 'Ceiling, can lights, hanging, wall mount, and exterior lights. Must include glass or globes.' },
      { i: 'Ladder', t: 'We do not accept wooden ladders. Must be in good working condition.' },
      { i: 'Lawn Mower', t: msg.working },
      { i: 'Vacuum', t: msg.working },
      { i: 'Tools', t: msg.working },
      { i: 'Window', t: 'Windows must be double-paned, in casings, and not just sashes.' },
    ],

  }

  return (
    <>
      {isOpen &&
        <>
          <Button onClick={(e: any) => handleClear(e)}>Reset</Button>
          <Button onClick={(e: any) => setDone(e)}>Save/Done</Button>
          <ToastContainer position="top-left" className='mytoast' autoClose={3000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

          <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
            <DonateType title='Bathroom:' hasCustom={'text'} chosen={donations} products={products.Bathroom} onClick={(e: any, i: any, l: any, t: string) => { handleProducts(e, i, l, t) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Bedroom:' hasCustom={'text'} chosen={donations} products={products.Bedroom} onClick={(e: any, i: any, l: any, t: string) => { handleProducts(e, i, l, t) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Dining Room:' hasCustom={'text'} chosen={donations} products={products['Dining Room']} onClick={(e: any, i: any, v: number, t: string) => { handleProducts(e, i, v, t) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Laundry:' hasCustom={'text'} chosen={donations} products={products['Laundry']} onClick={(e: any, i: any, v: number, t: string) => { handleProducts(e, i, v, t) }} onClear={(e: any) => { handleClear(e) }} />

            <DonateType title='Living Room:' hasCustom={'text'} chosen={donations} products={products['Living Room']} onClick={(e: any, i: any, v: number, t: string) => { handleProducts(e, i, v, t) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Kitchen:' hasCustom={'text'} chosen={donations} products={products['Kitchen']} onClick={(e: any, i: any, v: number, t: string) => { handleProducts(e, i, v, t) }} onClear={(e: any) => { handleClear(e) }} />

            <DonateType title='Office:' hasCustom={'text'} chosen={donations} products={products['Office']} onClick={(e: any, i: any, v: number, t: string) => { handleProducts(e, i, v, t) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Patio:' hasCustom={'text'} chosen={donations} products={products['Patio']} onClick={(e: any, i: any, v: number, t: string) => { handleProducts(e, i, v, t) }} onClear={(e: any) => { handleClear(e) }} />
            <DonateType title='Home Improvement:' hasCustom={'text'} chosen={donations} products={products['Home Improvement']} onClick={(e: any, i: any, v: number, t: string) => { handleProducts(e, i, v, t) }} onClear={(e: any) => { handleClear(e) }} />

          </Accordion>
        </>}
    </>
  )
}

interface IType {
  products: Iitems
  chosen: Iprods
  hasCustom: string
  title?: string
  onClick: Function
  onClear: Function
}
function DonateType({ products, title, chosen, hasCustom, onClick, onClear }: IType) {
  const handleClick = (e: string, id: number, t: string) => {
    console.log('DonateType', e, id)
    onClick(e, id, products, t)
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
        <TilesMulti tiles={products} selected={0} chosen={chosen} hasCustom={hasCustom} onClick={(e: any, i: any, t: string) => handleClick(e, i, t)} onClear={(e: any) => handleClear(e)} />
      </AccordionItemPanel>
    </AccordionItem>
  )

}
