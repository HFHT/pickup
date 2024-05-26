import { useEffect, useMemo, useState } from 'react'
import './main.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { CONST_EMAILS, CONST_ROUTE_MAX } from '../../constants';
import { BadgeIcons } from '../../icons/BadgeIcons';
import { Donations } from '../Donations';
import { useEmail, useExitPrompt, useHistoryBackTrap, useImageUpload, useMongo, useParams, usePhoneLookup, usePhoneSave, useSaveStop, useTrackBrowser } from '../../hooks';
import { buildSlots, dateDayName, dateFormat, findFirstSlot, find_id, find_row } from '../../helpers';
import { Button, Customer, DragDropFile, Iimg, Iimgs, Input } from '../../components';
import { handleBrokenImage } from '../../helpers/handleBrokenImage';

export function Main({ sas, clientInfo, schedule, settings, session, controls, id }: any) {
  const params = useParams(['debug', 'notrack', 'nosave']) // notrack: No entries in tracking db, nosave: no DB or Shopify updates

  const [_tracking, set_Tracking] = useState(session)
  const [_formFields, set_FormFields] = useState<ISched | null>(null)

  const [zip, setZip] = useState('')
  const [schedDate, setSchedDate] = useState('')
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
  const [reason, setReason] = useState('')
  const [imgs, setImgs] = useState<string[]>([])
  const [googlePlace, setGooglePlace] = useState<IPlace>({})
  const [curPage, setCurPage] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const [customItems, setCustomItems] = useState([])

  const [appt, setAppt] = useState<IAppt>({ id: id, slot: '1', rt: 'Unassigned', time: '1', cell: '' })
  const [customer, doPhoneLookup, isLookupLoading, lookupDone] = usePhoneLookup()
  const [, doPhoneSave, isSaving] = usePhoneSave()
  const [upLoadFile] = useImageUpload();
  const [, setShowExitPrompt] = useExitPrompt(false)
  const [sendEMail] = useEmail(toast)

  const [, updateSchedule, isFetching] = useMongo({ connection: { url: import.meta.env.VITE_MONGO_URL, collection: 'Schedule', key: '_id' }, setter: () => { console.log('fetched') }, noSave: params.nosave })
  const [, updateTrack, isTracking] = useMongo({ connection: { url: import.meta.env.VITE_MONGO_URL, collection: 'DonorTracking', key: '_id', find: { _id: clientInfo.fingerprint } }, setter: set_Tracking, noSave: params.nosave })
  const [doSaveStop, hasError, isSaving1] = useSaveStop(schedDate, updateSchedule, toast)
  const [doTrack] = useTrackBrowser({ browserSession: _tracking, clientInfo: clientInfo, dt: dateFormat(null), setter: updateTrack, notrack: params.notrack })

  const zipAvailSlots = useMemo(() => { /*console.log('useMemoNew-slots', dbSched, dbSettings);*/ return buildSlots(schedule, controls, find_row('_id', 'routes', settings), 'pickup')[0] }, [])
  useHistoryBackTrap(handleBack)

  const handleCustomer = (e: any) => {
    // Save the updated schedule, blank indicates that it is a Cancel
    console.log('Main handleCustomer', e, appt, phone, schedDate)
    if (e !== '' && appt) {
      console.log('handleCustomer-save')
      if (googlePlace.zip !== zip) toast.warn('Your selected delivery zip code does not match the address you provided.')
      let theseDonations: any = []
      donationList.forEach((d: any) => {
        if (d.prod !== undefined && d.prod !== '') { theseDonations.push(d) }
      })
      customItems.forEach((d: any) => {
        console.log(theseDonations)
        if (d !== undefined && d !== '') { theseDonations.push({ prod: d, qty: 0 }) }
      })
      set_FormFields(
        {
          id: id,
          name: name,
          phone: phone,
          email: email,
          cust: custInfo,
          zip: zip,
          place: googlePlace,
          appt: { ...e, time: findFirstSlot(schedule, schedDate) },
          dt: dateFormat(null),
          src: 'w',
          calls: [],
          items: theseDonations,
          imgs: imgs,
          note: '',
          waitlist: '',
          done: false,
          resched: false,
          fingerprint: clientInfo.fingerprint
        }
      )
    } else {
      console.log('handleCustomer-cancel')
      setCancelled(true)
      setCurPage(6)
      doTrack('X', zip, phone)
      setShowExitPrompt(false)
    }
  }

  const handleSubmit = () => {
    // Save the updated schedule, blank indicates that it is a Cancel
    console.log('Main handleSubmit', _formFields, params.nosave, phone, schedDate)
    if (!_formFields) return
    if (!params.nosave) {
      doTrack('C', zip, phone)
      doSaveStop(_formFields, whenUpdateDone)
    }
    function whenUpdateDone() {
      doPhoneSave(customer, _formFields)
      sendEMail({ email: { name: name, addr: googlePlace.addr, note: custInfo, email: email, date: schedDate, time: '' }, list: donationList, listAll: true, template: CONST_EMAILS.confirmation })
      doReset(true)
    }
  }

  async function handleBack() {
    console.log('handleBack', curPage)
    if (curPage > 0) handleNav(-1)
    return false
  }

  function handlePhone(p: string) {
    if (p.length === 11) {
      console.log('got phone', p)
      doPhoneLookup(p)
    }
    setPhone(p)
  }
  function handleCancel(code: 'C' | 'R' | 'X') {
    location.href = location.href
    // doTrack(code, zip, phone, reason)
    // doReset()
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
  function handleNext(thePage: number, noTrack: boolean = false) {
    setShowExitPrompt(true)
    setCurPage(thePage);
    thePage > maxPage && setMaxPage(thePage)
    !noTrack && doTrack(thePage, zip, phone)
  }
  function doReset(afterUpdate = false) {
    console.log('Main doReset', schedDate)
    setCurPage(afterUpdate ? 5 : 0)
    setSubmit(afterUpdate)
    setMaxPage(0)
    setSaved(false)
    setDonationList([])
    setCustomItems([])
    setHavePhotos(false)
    setSchedDate('')
    setName({ first: '', last: '', company: '' })
    setPhone('')
    setEmail('')
    setCustInfo({ apt: '', note: '' })
    setImgs([])
    setGooglePlace({ addr: '', lat: '', lng: '', zip: '' })
    setAppt({ id: id, slot: '1', rt: 'Unassigned', time: '1', cell: '' })
    set_FormFields(null)
    setZip('')
    setCancelled(false)
    setDonationInput('')
    setShowExitPrompt(false)
  }

  return (
    <>
      {!schedule ? <div>Loading...</div> :
        <>
          <BreadCrumbs crumbs={(!cancelled && !saved) ? [zip, schedDate, donationList.length > 0 ? 'items' : '', havePhotos ? 'photo' : ''] : []} />
          {/* <Navigation onClick={(e: number) => handleNav(e)} showBack={curPage > 0} showDone={saved || cancelled} showNext={curPage < maxPage} /> */}
          <Navigation onClick={(e: number) => handleNav(e)} showBack={curPage > 0} showDone={saved || cancelled} showNext={false} />

          <ZipList isOpen={curPage === 0} availSlots={zipAvailSlots} zip={zip} holidays={find_row('_id', 'Holidays', settings)} sched={schedDate} setSched={(e: any) => { handleNext(1); setSchedDate(e) }} setZip={(e: string) => setZip(e)} />
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
            setHaveCustomer={(e: any) => { handleNext(5, e === ''); handleCustomer(e) }}
          />
          <Confirm isOpen={curPage === 5} appt={_formFields} setSubmit={() => handleSubmit()} />
          <Saved isOpen={submit} onClick={() => handleCancel('C')} />
          <Cancelled isOpen={cancelled} reason={reason} setReason={(e: any) => setReason(e)} onClick={() => handleCancel('X')} />
        </>
      }
    </>
  )
}

function Confirm({ isOpen, appt, setSubmit }: any) {
  // console.log(isOpen, dbEntry);
  return (
    <>
      {(isOpen && appt) && <div className=''>
        <h3>Please confirm your Pickup.</h3>
        <div className='confirmdiv'>
          <div>Date:</div>
          <div>{appt.dt}</div>
          <div>Name:</div>
          <div>{`${appt.name.first} ${appt.name.last}`}</div>
          <div>Phone:</div>
          <div>{appt.phone}</div>
          <div>Address:</div>
          <div>{appt.place.addr}</div>
          <div>Items:</div>
          <div>{
            appt.items.map((ti: any, k: number) => (
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
                appt.imgs.map((img: any, k: number) => (
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

function Cancelled({ isOpen, onClick, reason, setReason }: any) {
  return (
    <>
      {isOpen && <div className='canceldiv'>
        <h3>Thank you for thinking of us. </h3>
        <blockquote>Before you go, could you let us know why you cancelled your donation?</blockquote>
        <textarea value={reason} title='Reason' placeholder='Reason...' rows={4} cols={40} className='canceltext' spellCheck onChange={(e) => { setReason(e.target.value) }}>
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