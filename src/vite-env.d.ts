/// <reference types="vite/client" />
interface IControls {
  _id: string
  blocks: IBlocks[]
}
interface IBlocks {
  date: string
  routes: string[]
}
interface ISlot {
  r: string;                  // Route 'Blue'
  s: number;                  // Stop on the route
  c: number;                  // index into the client array
  n: 1 | 2;                   // slots taken (1 or 2)
  d: boolean;                 // Stop completed
  x: boolean;                 // Stop cancelled
}
interface ISlots extends Array<ISlot> { }

interface Iprod {
  prod: string;
  qty: number;
}
interface Iprods extends Array<Iprod> { }

// interface Itile {
//   i: string;
//   t: string
// }
// interface Itiles extends Array<Itile> { }

interface IPlace {
  addr?: string;
  lat?: string;
  lng?: string;
  zip?: string;
  num?: string
  route?: string
  city?: string
  state?: string
  c_cd?: string
  c_nm?: string
}
interface Idb extends Array<IScheds> { }

interface IScheds {
  _id: string
  c: [ISched]
}
interface ISched {
  id: string
  dt: string
  idx?: number
  name: IName
  phone: string
  email: string
  cust: ICustInfo
  zip: string
  place: IPlace
  appt: IAppt
  items: Iitem[];
  imgs: string[]
  src: null | '' | 'w' | 's' | 'o' | 'd' | 'x' // w-web, s-scheduler, d-delivery, x - block slot
  call?: string
  done?: boolean
  resched?: boolean
  note?: string
  calls: Icall[]
  remind?: boolean
  waitlist?: string
  full?: boolean
  gpsStop?: string
  fingerprint?: string
}
interface IName {
  first: string
  last: string
  company?: string | undefined | null
}
interface Iitem {
  prod: string;
  qty: number;
  c?: boolean;
}
interface ICustInfo {
  apt: string
  note: string
}
interface IAppt {
  id: string;
  // apt: string;
  // note: string;
  // email: string;
  slot: string;
  rt: string;
  time: string;
  cell: string;
}
interface IEdit {
  zip?: string;
  id?: string;
  src?: string;
}