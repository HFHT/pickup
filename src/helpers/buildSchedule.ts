import { CONST_CANCEL_ROUTE, CONST_DEFAULT_ROUTE, CONST_QTY_ROUTES } from "../constants"
import { find_row } from "./find_id"

export function buildSchedule(dt: string, routes: any, db: any): ISched[][] {
  // console.log('buildSchedule', dt, find_row('_id', dt, db))
  let thisSched: any = []
  for (let j = 0; j < CONST_QTY_ROUTES; j++) {
    thisSched.push([])
  }
  const theRow: IScheds = find_row('_id', dt, db)
  console.log(thisSched, theRow)
  if (theRow) {
    let aryRouteOffset = -1
    let thisApptTime = 0
    theRow.c.forEach((thisAppt, i: number) => {
      console.log(thisAppt, thisAppt?.appt?.rt, i, thisAppt?.appt?.time)
      aryRouteOffset = routes.findIndex(((a: any) => a[0] === (thisAppt.appt.rt ? thisAppt.appt.rt : CONST_DEFAULT_ROUTE)))
      console.log(aryRouteOffset)
      thisApptTime = Number(thisAppt.appt.time)
      if (aryRouteOffset > -1) {
        thisSched[aryRouteOffset][thisApptTime ? thisApptTime - 1 : 0] = thisAppt;
      } else {
        if (thisAppt.appt.rt !== CONST_CANCEL_ROUTE) {
          alert(`Invalid route in database, contact support. Day=${dt} Route=${thisAppt.appt.rt} Name=${thisAppt.name.first} ${thisAppt.name.last}`)
        }
      }
    })
  }
  // console.log(thisSched)
  return thisSched
}