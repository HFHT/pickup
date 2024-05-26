import { useState } from 'react'
import { fetchDays, find_id } from '../helpers'

//
//Receives a Stop, refetches the day so it is current, updates and then saves the day
//
export function useSaveStop(schedDate: string, update: Function, toast: any) {
    const [hasError, setHasError] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    console.log('useSaveStop', schedDate)
    async function doSaveStop(theStop: ISched, whenDone: Function) {
        console.log('useSaveStop-doSaveStop', theStop)
        setHasError(false)
        setIsSaving(true)
        let theDay: IScheds[] | undefined = await fetchDays([schedDate])
        if (theDay === undefined) {
            setHasError(true)
            setIsSaving(false)
            toast('Could not fetch schedule from database, please try again later!')
            return
        }

        if (theDay.length > 0) {
            theDay[0].c.push(theStop)
            // const whichRow = find_id('id', theStop.id, theDay[0].c)
            // if (whichRow < 0) {
            //     setHasError(true)
            //     setIsSaving(false)
            //     toast('Contact Support, invalid record (doSaveStop).')
            //     return
            // }            
            // theDay[0].c[whichRow] = theStop
        } else {
            theDay[0] = { _id: schedDate, c: [theStop] }
        }
        console.log('useSaveStop-doSaveStop', theDay)
        await update(theDay[0])
        whenDone()
        setIsSaving(false)
    }
    return [doSaveStop, hasError, isSaving] as const
}