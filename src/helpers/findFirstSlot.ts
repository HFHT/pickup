import { CONST_DEFAULT_ROUTE } from "../constants"
import { getApptFromDbSched } from "./getApptFromDbSched"

export function findFirstSlot(dbSched: Idb, sched: string) {
    const theAppt = getApptFromDbSched(dbSched, sched)
    console.log(theAppt)
    if (theAppt.retNotFound) return '1'
    let usedSlots: boolean[] = []
    for (let i = 0; i < theAppt.retStops.length; i++) {
        if (theAppt.retStops[i].appt.rt === CONST_DEFAULT_ROUTE)
            usedSlots[Number(theAppt.retStops[i].appt.time)] = true
    }
    console.log(usedSlots)
    for (let i = 1; i < usedSlots.length; i++) {
        console.log(usedSlots[i], !usedSlots[i])
        if (usedSlots[i] === undefined) { console.log('firstSlot', i); return (i).toString() }
    }
    return (usedSlots.length).toString()
}