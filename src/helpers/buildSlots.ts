import { findBlockRoute } from "."
import { routeLoadSize, routeZips } from "../constants"
import { dateAdjust, dateFormat } from "./dateDB"

export function buildSlots(db: Idb, dbCntl: IControls[]) {
  //dbSched.data.slots = r:route, s:stop, n:# of slots, c:customer idx, d:done, x:cancelled
  if (!db || !dbCntl) { return [] }
  const routes: ISlots = [
    { r: 'Blue', s: 4, n: 2, c: 1, d: false, x: false }
  ]
  // console.log('buildSlots', routeZips)
  //Builds the routeAvail array 
  //[{85614: [{ dt: '10/23/23', t: 10, u: 4 }, { dt: '10/30/23', t: 10, u: 2 }]}]
  //For each zip, build next 6 day of week dates, total the number of slots for that day, 
  //then total the number of used slots from DBSched
  //!!!! Future, add truck for each date 
  let routeAvail = {}
  Object.keys(routeZips).forEach(function (key, i) {
    let availDate = routeZips[key].map((thisDate: any) => {
      return calcAvailDates(thisDate, db, dbCntl)
    })
    let availMerge: any = mergeAvail(availDate)
    routeAvail = { ...routeAvail, [key]: availMerge }
  })
  // console.log(routeAvail)
  return [routeAvail]
}
function calcAvailDates(dt: any, db: Idb, dbCntl: IControls[]) {
  // Takes d.dow figures out the next real date, from day after tomorrow on
  var cd = new Date(new Date().getTime() + 48 * 60 * 60 * 1000)
  // console.log(cd.toDateString(), cd.getDate(), d.dow, cd.getDay(), (7 + d.dow - cd.getDay()) % 7)
  let d1: any = cd.setDate(cd.getDate() + (7 + dt.dow - cd.getDay()) % 7)
  // console.log(d1, new Date(d1).toDateString())
  d1 = dateFormat(d1)

  // console.log(d1)
  const ns = sumSlots(dt)
  return [
    { d: d1, t: ns, u: calcUsed(d1, dt, db, dbCntl) },
    { d: dateAdjust(d1, 7), t: ns, u: calcUsed(dateAdjust(d1, 7), dt, db, dbCntl) },
    { d: dateAdjust(d1, 14), t: ns, u: calcUsed(dateAdjust(d1, 14), dt, db, dbCntl) },
    { d: dateAdjust(d1, 21), t: ns, u: calcUsed(dateAdjust(d1, 21), dt, db, dbCntl) },
    { d: dateAdjust(d1, 28), t: ns, u: calcUsed(dateAdjust(d1, 28), dt, db, dbCntl) }
  ]
}
function sumSlots(d: any) {
  // Takes d.rt and sums the available slots for d.dow 
  return d.rt.map((rt: any) => sumDow(rt, d.dow)).reduce((tot: any, cur: any) => tot + cur)
}
function sumDow(r: any, dw: any) {
  const rt = routeLoadSize[r]
  return rt[dw]
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
function calcUsed(cd: any, dt: any, db: Idb, dbCntl: IControls[]) {
  // Look through all the schedDB.data for any slots that are taken for that day and return a total used
  //dbSched.data.slots = r:route, s:stop, n:# of slots, c:customer idx, d:done, x:cancelled
  const hasBlockedRoutes = findBlockRoute(cd, dbCntl)
  let blocked = 0
  if (hasBlockedRoutes[1] > -1) {
    const theBlocks = hasBlockedRoutes[0][hasBlockedRoutes[1]].routes
    theBlocks.forEach((blockRoute:string, idx:number) => {
      blocked = blocked + routeLoadSize[blockRoute][dt.dow]
    })
    // console.log('!!!!', blocked, hasBlockedRoutes[0][hasBlockedRoutes[1]].routes)
  }
  let ds: any = db.filter((td: any) => td._id.slice(0, 10) === cd)
  if (ds.length > 0) {
    //Sum all the slots
    let s = 0
    ds.forEach((m0: any) => {
      m0.c.forEach((m1: any) => {
        m1.hasOwnProperty('appt') && m1.appt.hasOwnProperty('slot') && (s = s + Number(m1.appt.slot))
      })
    })
    return s + blocked
  }
  return 0
}