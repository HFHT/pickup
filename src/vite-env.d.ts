/// <reference types="vite/client" />

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

interface Iitem {
  i: string;
  t: string
}
interface Iitems extends Array<Iitem> { }

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
  id: string;
  dt: string;
  name: {
    first: string;
    last: string;
  };
  phone: string;
  zip: string;
  place: IPlace;
  appt: IAppt
  imgs: string[]
  items: any;
  src: null | '' | 'w' | 's' | 'o';
  call?: string;
  done?: boolean;
  resched?: boolean;
}
interface IAppt {
  id: string;
  apt: string;
  note: string;
  email: string;
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