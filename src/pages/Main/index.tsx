import { useEffect, useMemo, useState } from 'react'
import './main.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { CONST_EMAILS, CONST_ROUTE_MAX } from '../../constants';
import { BadgeIcons } from '../../icons/BadgeIcons';
import { Donations } from '../Donations';
import { useDb, useDbSched, useEmail, useExitPrompt, useHistoryBackTrap, useImageUpload, usePhoneLookup, usePhoneSave } from '../../hooks';
import { buildSlots, dateDayName, dateFormat, findFirstSlot, find_id, find_row } from '../../helpers';
import { Button, Customer, DragDropFile, Iimg, Iimgs, Input } from '../../components';
import { handleBrokenImage } from '../../helpers/handleBrokenImage';

export function Main({ sas, clientInfo, settings, id }: any) {
  const [zip, setZip] = useState('')
  const [sched, setSched] = useState('')
  const [havePhotos, setHavePhotos] = useState(false)
  const [saved, setSaved] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [donationList, setDonationList] = useState([])
  const [donationInput, setDonationInput] = useState('')

  const [name, setName] = useState<IName>({ first: '', last: '', company: '' })
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [custInfo, setCustInfo] = useState({ apt: '', note: '' })

  const [imgs, setImgs] = useState<string[]>([])
  const [googlePlace, setGooglePlace] = useState<IPlace>({})
  const [curPage, setCurPage] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const [customItems, setCustomItems] = useState([])

  const [appt, setAppt] = useState<IAppt>({ id: id, slot: '1', rt: 'Unassigned', time: '1', cell: '' })
  const [dbEntry, setDBEntry] = useState<ISched | null>(null)
  const [customer, doPhoneLookup, isLookupLoading, lookupDone] = usePhoneLookup()
  const [customer1, doPhoneSave, isSaving] = usePhoneSave()
  const [upLoadFile] = useImageUpload();
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false)
  const [sendEMail] = useEmail(toast)


  const [dbSched, addNew, update] = useDbSched()
  const [dbCntl, mutateCntl, updateCntl, cntlFetching] = useDb({ key: 'controls', theDB: 'Controls', interval: 4 })
  const [dbTrack, mutateTrack, updateTrack, trackFetching] = useDb({ key: 'track', theDB: 'DonorTracking', _id: clientInfo.fingerprint, interval: 40 })
  const availSlots: any = useMemo(() => { console.log('useMemo'); return buildSlots(dbSched, dbCntl)[0] }, [dbSched, dbCntl, cntlFetching])
  useHistoryBackTrap(handleBack)
  useEffect(() => {
    console.log('useEffect-dbTrack', dbTrack)
    if (!dbTrack) return
    if (dbTrack.length === 0) {
      mutateTrack({ _id: clientInfo.fingerprint, browser: clientInfo.client, sessions: [{ dt: dateFormat(null), step: 0, zip: '' }] }, dbTrack, true)
    } else {
      const dIdx: number = find_id('dt', dateFormat(null), dbTrack[0].sessions)
      let thisTrack = { ...dbTrack[0] }
      console.log(dIdx)
      if (dIdx === -1) {
        thisTrack.sessions.push({ dt: dateFormat(null), step: 0, zip: '' })
        console.log(thisTrack)
        mutateTrack({ ...thisTrack }, dbTrack, false)
      }
    }
  }, [dbTrack])

  const handleCustomer = (e: any) => {
    // Save the updated schedule, blank indicates that it is a Cancel
    console.log('Main handleCustomer', e, appt, phone, sched)
    if (e !== '' && appt) {
      if (googlePlace.zip !== zip) toast.warn('Your selected delivery zip code does not match the address you provided.')
      let theseDonations: any = []
      donationList.forEach((d: any) => {
        if (d.prod !== undefined && d.prod !== '') { theseDonations.push(d) }
      })
      customItems.forEach((d: any) => {
        console.log(theseDonations)
        if (d !== undefined && d !== '') { theseDonations.push({ prod: d, qty: 0 }) }
      })
      setDBEntry(
        {
          id: id,
          name: name,
          phone: phone,
          email: email,
          cust: custInfo,
          zip: zip,
          place: googlePlace,
          appt: { ...e, time: findFirstSlot(dbSched, sched) },
          dt: dateFormat(null),
          src: 'w',
          calls: [],
          items: theseDonations,
          imgs: imgs,
          note: '',
          waitlist: '',
          done: false,
          resched: false
        }
      )
    } else {
      setCancelled(true)
      setCurPage(6)
      doTrack('X', zip)

    }
  }

  const handleSubmit = () => {
    // Save the updated schedule, blank indicates that it is a Cancel
    console.log('Main handleSubmit', appt, phone, sched)
    if (!dbEntry) return
    addNew({ _id: sched, c: [dbEntry] }, dbSched)
    doPhoneSave(customer, dbEntry)
    sendEMail({ email: { name: name, addr: googlePlace.addr, note: custInfo, email: email, date: sched, time: '' }, list: donationList, listAll: true, template: CONST_EMAILS.confirmation })
    setSaved(true)
    setSubmit(true)
    setSched('')
    setName({ first: '', last: '', company: '' })
    setPhone('')
    setEmail('')
    setCustInfo({ apt: '', note: '' })
    setImgs([])
    setGooglePlace({ addr: '', lat: '', lng: '', zip: '' })
    setAppt({ id: id, slot: '1', rt: 'Unassigned', time: '1', cell: '' })
    setDBEntry(null)
    setZip('')
    setCurPage(5)
    setDonationList([])
    setCustomItems([])
    setDonationInput('')
    setShowExitPrompt(false)
    doTrack('C', zip)
  }

  async function handleBack() {
    console.log('handleBack', curPage)
    if (curPage > 0) handleNav(-1)
    return false
  }
  function doTrack(step: number | string, zip: string) {
    const dIdx: number = find_id('dt', dateFormat(null), dbTrack[0].sessions)
    let thisTrack = { ...dbTrack[0] }
    console.log(dIdx)
    if (dIdx > -1) {
      let sessions = { ...thisTrack.sessions[dIdx] }
      sessions = { ...sessions, step: step.toString(), zip: zip }
      thisTrack.sessions[dIdx] = { ...sessions }
      console.log(thisTrack)
      mutateTrack({ ...thisTrack }, dbTrack, false)
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
  function handleCancel(code: string) {
    location.href = location.href
    doTrack(code, zip)
    doReset()
  }
  function setPhotos(photos: Iimgs) {
    console.log(photos)
    if (photos.length === 0) return
    let photoNames: string[] = []
    photos.forEach((photo: Iimg, idx: number) => {
      photoNames[idx] = `${id}${idx}.${photo.blob.name.split('.').pop()}`
      upLoadFile(photo.blob, photoNames[idx], sas)
    })
    setImgs(photoNames)
  }
  useEffect(() => {
    if (!customer || !customer[0] || customer.length === 0) return
    console.log(customer)
    setName(customer[0].name)
    setGooglePlace(customer[0].addr)
    setEmail(customer[0].email)
    setCustInfo({ apt: customer[0].apt, note: customer[0].nt })
    setAppt({ ...appt })
  }, [customer])

  function handleNav(direction: number) {
    console.log(direction)
    if (direction === 0) {
      doReset()
    } else {
      setCurPage(curPage + direction)
    }
  }
  function handleNext(thePage: number) {
    setShowExitPrompt(true)
    setCurPage(thePage);
    thePage > maxPage && setMaxPage(thePage)
    doTrack(thePage, zip)
  }
  function doReset() {
    console.log('Main doReset', sched)
    setCurPage(0)
    setMaxPage(0)
    setSaved(false)
    setDonationList([])
    setCustomItems([])
    setHavePhotos(false)
    setSched('')
    setName({ first: '', last: '', company: '' })
    setPhone('')
    setEmail('')
    setCustInfo({ apt: '', note: '' })
    setImgs([])
    setGooglePlace({})
    setAppt({ id: id, slot: '1', rt: 'Unassigned', time: '1', cell: '' })
    setDBEntry(null)
    setZip('')
    setSubmit(false)
    setCancelled(false)
    setDonationInput('')
    setShowExitPrompt(false)

  }
  return (
    <>
      {!dbSched ? <div>Loading...</div> :
        <>
          <BreadCrumbs crumbs={(!cancelled && !saved) ? [zip, sched, donationList.length > 0 ? 'items' : '', havePhotos ? 'photo' : ''] : []} />
          {/* <Navigation onClick={(e: number) => handleNav(e)} showBack={curPage > 0} showDone={saved || cancelled} showNext={curPage < maxPage} /> */}
          <Navigation onClick={(e: number) => handleNav(e)} showBack={curPage > 0} showDone={saved || cancelled} showNext={false} />

          <ZipList isOpen={curPage === 0} availSlots={availSlots} zip={zip} holidays={find_row('_id', 'Holidays', settings)} sched={sched} setSched={(e: any) => { handleNext(1); setSched(e) }} setZip={(e: string) => setZip(e)} />
          <NotAccepted isOpen={curPage === 1} setUnderstood={() => handleNext(2)} />
          <Donations isOpen={curPage === 2}
            donations={donationList} setDonations={(e: any) => { handleNext(3); setDonationList(e) }}
            donationInput={donationInput} setDonationInput={(e: any) => setDonationInput(e)}
          />
          <Photos isOpen={curPage === 3} setHavePhotos={setHavePhotos} setPhotos={(e: any) => { handleNext(4); setPhotos(e) }} />
          <Customer
            id={id}
            isOpen={curPage === 4}
            name={name}
            setName={(e: any) => setName(e)}
            phone={phone}
            setPhone={(e: any) => handlePhone(e)}
            email={email}
            setEmail={(e: any) => setEmail(e)}
            custInfo={custInfo}
            setCustInfo={(e: any) => setCustInfo(e)}
            lookupDone={lookupDone}
            place={googlePlace}
            setPlace={(e: any) => setGooglePlace(e)}
            appt={appt}
            setAppt={(e: any) => setAppt(e)}
            setHaveCustomer={(e: any) => { handleNext(5); handleCustomer(e) }}
          />
          <Confirm isOpen={curPage === 5} dbEntry={dbEntry} setSubmit={() => handleSubmit()} />
          <Saved isOpen={submit} onClick={() => handleCancel('C')} />
          <Cancelled isOpen={cancelled} onClick={() => handleCancel('X')} />
        </>
      }
    </>
  )
}

function Confirm({ isOpen, dbEntry, setSubmit }: any) {
  // console.log(isOpen, dbEntry);
  return (
    <>
      {(isOpen && dbEntry) && <div className=''>
        <h3>Please confirm your Pickup.</h3>
        <div className='confirmdiv'>
          <div>Date:</div>
          <div>{dbEntry.dt}</div>
          <div>Name:</div>
          <div>{`${dbEntry.name.first} ${dbEntry.name.last}`}</div>
          <div>Phone:</div>
          <div>{dbEntry.phone}</div>
          <div>Address:</div>
          <div>{dbEntry.place.addr}</div>
          <div>Items:</div>
          <div>{
            dbEntry.items.map((ti: any, k: number) => (
              <div key={k}>
                {ti.qty === 0 ? `${ti.prod}` : `${ti.prod}(${ti.qty})`}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className='photogrid'>
            <div className="container">
              {
                dbEntry.imgs.map((img: any, k: number) => (
                  <div className="image" key={k}>
                    <img key={k} title='item image'
                      src={`${import.meta.env.VITE_STORAGEIMAGEURL}${img}`}
                      onError={(e) => handleBrokenImage(e)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <Button onClick={() => setSubmit()}>Confirm</Button>
      </div>}
    </>
  )
}

function Photos({ isOpen, setHavePhotos, setPhotos }: any) {
  const [images, setImages] = useState<Iimgs>([])

  function handleClick() {
    setHavePhotos(true)
    setPhotos(images)
  }
  return <>
    {isOpen &&
      <div className='photodiv'>
        <DragDropFile images={images} title='Please send us a photo of your items.' setImages={setImages} />
        <Button onClick={() => handleClick()}> Done </Button>
      </div>}

  </>
}

function Saved({ isOpen, onClick }: any) {
  return (
    <>
      {isOpen && <>
        <h3>Thank you for your donation. </h3>
        <blockquote>Proceeds generated from the HabiStore support Habitat Tucson's mission to build more affordable homes locally.</blockquote>
        <Button onClick={() => onClick()}>Done</Button>
        <div className='savedimage'></div>
      </>}
    </>
  )
}

function Cancelled({ isOpen, onClick }: any) {
  return (
    <>
      {isOpen && <div className='canceldiv'>
        <h3>Thank you for thinking of us. </h3>
        <blockquote>Before you go, could you let us know why you cancelled your donation?</blockquote>
        <textarea title='Reason' placeholder='Reason...' rows={4} cols={40} className='canceltext' spellCheck>
        </textarea>
        <Button onClick={() => onClick()}>Done</Button>
        <div className='cancelimage'></div>

      </div>}
    </>
  )
}


function BreadCrumbs({ crumbs }: any) {
  return (
    <div className='breadcrumb'><span>&nbsp;</span>
      {crumbs.map((bc: string, k: number) => (<span key={k}>{bc !== '' && `${bc}/`}</span>))}
    </div>
  )
}

function Navigation({ onClick, showBack, showDone, showNext }: any) {
  return (
    <div className='navigation'>
      {!showDone && <div className='navleft' onClick={() => onClick(-1)}>{showBack && BadgeIcons('Left')}</div>}
      {/* {showDone && <div className='navleft' onClick={() => onClick(0)}>{BadgeIcons('Return')}</div>} */}
      <div className='navright' onClick={() => onClick(1)}>{showNext && BadgeIcons('Right')}</div>
    </div>
  )
}

interface IZip {
  isOpen: boolean
  availSlots: any
  holidays: any
  zip: string
  sched: string
  setSched: Function
  setZip: Function
}
function ZipList({ isOpen, availSlots, zip, holidays, sched, setSched, setZip }: IZip) {
  const zipOpen = () => {
    return zip.length === 5
  }
  const zipFound = () => {
    // console.log(zipOpen(), availSlots)
    return zipOpen() && availSlots && availSlots.hasOwnProperty(zip)
  }
  const isDayClosed = (thisSlot: any) => {
    // Day is closed if the route is at Maximum or it is a Holiday
    if (thisSlot.t - thisSlot.u < CONST_ROUTE_MAX) return true
    return holidays.dates.some((theHoliday: any) => theHoliday.date === thisSlot.d)
  }
  return (<>
    {isOpen && availSlots &&
      <>
        <Input type={'number'} value={zip} title={'Your zip code'} onChange={(e: string) => setZip(e)} />
        <div className={`${zipOpen() ? 'zipopen' : 'zipclosed'} zipmenu`}>
          {zipOpen() && (zipFound() ? 'Available Pickup Dates:' : 'Not in our Service Area')}
          {zipOpen() && zipFound() ?
            <div className='ziplist'>
              {availSlots[zip].map((availSlot: any, key: number) => (
                <Button key={key} variant={sched === availSlot.d ? 'contained' : 'outlined'} classes={isDayClosed(availSlot) ? 'hidden' : ''} onClick={() => setSched(`${availSlot.d}`)}>{dateDayName(availSlot.d)} {availSlot.d}</Button>
              ))}
            </div>
            :
            !zipOpen() && <h1 className='ziptext'>Tucson's Most Trusted Home Improvement Superstore</h1>
          }

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