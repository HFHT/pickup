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

interface IPlace {
    addr?: string;
    lat?: string;
    lng?: string;
    zip?: string;
  }
  interface Idb extends Array<IScheds> { }

  interface IScheds {
    _id: string
    c: [ISched]
}
  interface ISched {
    id: string;
    dt: string;
    name: string;
    phone: string;
    zip: string;
    place: IPlace;
    appt: IAppt
    src: string;
    call?: string;
    done?: boolean;
}
  interface IAppt {
    id: string;
    items: string;
    apt: string;
    note: string;
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