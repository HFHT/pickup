import { dateAdjust, dateFormat, findBlockRoute } from "."
import { CONST_CANCEL_ROUTE, CONST_QTY_SLOTS } from "../constants"

export function buildSlots(db: Idb, dbCntl: IControls[], dbSettings: DBRoutes, type: 'pickup' | 'delivery') {

  if (!db || !dbCntl || !dbSettings) { return [] }
  //Builds the routeAvail array 
  //[{85614: [{ dt: '10/23/23', t: 10, u: 4 }, { dt: '10/30/23', t: 10, u: 2 }]}]
  //For each zip, build next 6 day of week dates, total the number of slots for that day, 
  //then total the number of used slots from DBSched
  //!!!! Future, add truck for each date 
  let routeAvail = {}
  Object.keys(dbSettings.routes).forEach(function (key, i) {
    try {
      let availDate = dbSettings.routes[key].map((thisRouteZip: { dow: number, rt: string[] }) => {
        return calcAvailDates(thisRouteZip, db, dbCntl, dbSettings.trucks, type)
      })
      let availMerge: any = mergeAvail(availDate)
      routeAvail = { ...routeAvail, [key]: availMerge }
    }
    catch (e) {
      throw ({ msg: `Contact Support, build slots error. Key: ${key}, Number: ${i}`, e: e })
    }
  })
  return [routeAvail]
}
function calcAvailDates(rz: { dow: number, rt: string[] }, db: Idb, dbCntl: IControls[], trucks: any[], type: string) {
  // Takes d.dow figures out the next real date, from tomorrow on, plus the five after that TRUCK_FUTURE_DAYS
  var cd = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  let d1: any = cd.setDate(cd.getDate() + (7 + rz.dow - cd.getDay()) % 7)
  d1 = dateFormat(d1)

  // Sum the slots
  const ns = rz.rt.map((rt: any) => trucks[rt][type].loadsize[rz.dow]).reduce((tot: any, cur: any) => tot + cur)
  return [
    { d: d1, t: ns, u: calcUsed(d1, rz, db, dbCntl, trucks, type) },
    { d: dateAdjust(d1, 7), t: ns, u: calcUsed(dateAdjust(d1, 7), rz, db, dbCntl, trucks, type) },
    { d: dateAdjust(d1, 14), t: ns, u: calcUsed(dateAdjust(d1, 14), rz, db, dbCntl, trucks, type) },
    { d: dateAdjust(d1, 21), t: ns, u: calcUsed(dateAdjust(d1, 21), rz, db, dbCntl, trucks, type) },
    { d: dateAdjust(d1, 28), t: ns, u: calcUsed(dateAdjust(d1, 28), rz, db, dbCntl, trucks, type) }
  ]
}

function mergeAvail(da: any) {
  let m: any = []
  da.forEach((dsa: any) => {
    dsa.forEach((dsaa: any) => {
      m.push(dsaa)
    })
  })
  m.sort((a: any, b: any) => {
    if (a.d < b.d) return -1
    if (a.d > b.d) return 1
    return 0
  })
  return m
}
function calcUsed(cd: any, dt: any, db: Idb, dbCntl: IControls[], trucks: any[], type: string) {
  // Look through all the schedDB.data for any slots that are taken for that day and return a total used
  const hasBlockedRoutes = findBlockRoute(cd, dbCntl)
  let blocked = 0
  if (hasBlockedRoutes[1] > -1) {
    const theBlocks = hasBlockedRoutes[0][hasBlockedRoutes[1]].routes
    theBlocks.forEach((blockRoute: string, idx: number) => {
      //@ts-ignore
      blocked = blocked + trucks[blockRoute][type].loadsize[dt.dow]
    })
  }
  const validSrc = (type === 'delivery') ? ['d'] : ['w', 's']
  let ds: any = db.filter((td: any) => td._id.slice(0, 10) === cd)
  if (ds.length > 0) {
    //Sum all the slots
    let s = 0
    ds.forEach((m0: any) => {
      m0.c.forEach((m1: any) => {
        if (m1.hasOwnProperty('appt')) {
          if (m1.appt.hasOwnProperty('slot')) {
            if ((m1.appt.rt !== CONST_CANCEL_ROUTE) && (validSrc.includes(m1.src))) {
              s = s + Number(m1.appt.slot)
            }
          }
        }
      })
    })
    return s + blocked
  }
  return 0
}

export function slotControls(schedule: ISched[]) {
  let theSlots: boolean[] = []
  if (!schedule) {
    return []
  }
  for (let j = 0; j < CONST_QTY_SLOTS; j++) {
    theSlots.push(false);
  }
  schedule.forEach((thisAppt, i: number) => {
    let startSlot = Number(thisAppt.appt.time) - 1
    const numSlots = Number(thisAppt.appt.slot)
    for (let j = startSlot; j < startSlot + numSlots; j++) {
      theSlots[j] = true
    }
  })
  return theSlots
}

export function usedSlots(route: ISched[]) {
  return route.length > 0 ? route.reduce((acc: number, obj: ISched) => { return acc + Number(obj.appt.slot) }, 0) : 0
}