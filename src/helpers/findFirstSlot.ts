import { CONST_DEFAULT_ROUTE, CONST_ROUTE, CONST_ROUTES } from "../constants"
import { buildSchedule } from "./buildSchedule"
import { getApptFromDbSched } from "./getApptFromDbSched"

export function findFirstSlot(dbSched: Idb, sched: string) {
    const theAppt = getApptFromDbSched(dbSched, sched)
    console.log(theAppt)
    if (theAppt.retNotFound) return '1'
    const theNewSchedule = buildSchedule(sched, Object.entries(CONST_ROUTE), dbSched)
    return (theNewSchedule[CONST_ROUTES.indexOf(CONST_DEFAULT_ROUTE)].length + 1).toString()
}