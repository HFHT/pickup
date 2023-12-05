import { find_id, find_row } from "./find_id";

export type retGetAppt = {
    retStops: [ISched]
    retDbIdx: number
    retApptIdx: number
}
export const getApptFromDbSched = (dbSched: any, theDate: string, apptId?: string): retGetAppt => {
    const theseScheds: IScheds = find_row('_id', theDate, dbSched)
    const theSchedIdx: number = find_id('_id', theDate, dbSched)
    const apptIdx: number = apptId ? find_id('id', apptId, theseScheds.c) : -1
    let theStops = dbSched[theSchedIdx].c
    return ({ retStops: theStops, retDbIdx: theSchedIdx, retApptIdx: apptIdx })
};

export const removeApptFromDbSched = (dbSched: any, theDate: string, apptId: string, update:Function) => {
    const theAppt = getApptFromDbSched(dbSched, theDate, apptId)
    console.log(theAppt.retStops)
    theAppt.retStops.splice(theAppt.retApptIdx, 1)
    console.log(theAppt.retStops)
    dbSched[theAppt.retDbIdx].c = theAppt.retStops
    update(dbSched[theAppt.retDbIdx])
}