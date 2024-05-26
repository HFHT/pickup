import { useEffect, useState } from "react"
import { find_id } from "../helpers"

interface IuseTrackBrowser {
    browserSession: trackBrowserT[] | [] | undefined
    clientInfo: clientInfoT
    setter: Function
    dt: string
    notrack?: boolean
}
type clientInfoT = {
    fingerprint: number | string
    language: string
    client: {
        browser: {}
        cpu: {}
        device: {}
        engine: {}
        os: {}
        ua: string
    }
}
type trackBrowserT = {
    _id: number | string
    browser: any
    sessions: sessionT[]
}
type sessionT = {
    dt: string
    step: string
    zip: string
    phone: string
    reason?: string | undefined
}
export function useTrackBrowser({ browserSession, clientInfo, dt, setter, notrack }: IuseTrackBrowser) {
    const [prevTrack, setPrevTrack] = useState<sessionT | null>()

    useEffect(() => {
        console.log('useTrackBrowser-useEffect', browserSession)
        if (browserSession === undefined) {
            console.log('error, undefined browserSession')
            setter([])
            return
        }
        if (browserSession.length === 0 || !browserSession[0].hasOwnProperty('sessions')) {
            let initSession: trackBrowserT = {
                _id: clientInfo.fingerprint,
                browser: clientInfo.client,
                sessions: [{ dt: dt, step: '0', zip: '', phone: '' }]
            }
            !notrack && setter(initSession)
        }
    }, [])

    function doTrack(step: number | 'C' | 'R' | 'X', zip: string, phone: string, reason?: undefined | string) {
        console.log(browserSession, step, zip, phone, reason, notrack)
        if (notrack) return
        if (!browserSession) {
            alert('!browserSession')
            return
        }
        if (browserSession.length === 0 || !browserSession[0].hasOwnProperty('sessions')) {
            alert('empty browserSession')
            return
        }
        const sessionIdx: number = find_id('dt', dt, browserSession![0].sessions)
        if (sessionIdx < 0) {
            alert('empty sessions')
            return
        }
        let thisSession: sessionT = browserSession![0].sessions[sessionIdx]
        if (doTrackUpdate(step, thisSession.step)) {
            thisSession = { ...thisSession, step: step.toString(), zip: zip, phone: phone }
            if (reason) {
                thisSession = { ...thisSession, reason: reason }
            }
            browserSession[0].sessions[sessionIdx] = { ...thisSession }
            setter(browserSession[0])
            setPrevTrack(thisSession)
        }
        function doTrackUpdate(step: number | 'C' | 'R' | 'X', sessionStep: any) {
            console.log('doTrackCheck', step, prevTrack, sessionStep)
            if (!prevTrack) return true
            if (prevTrack.step === 'C') return false
            if (step === 'R' && (sessionStep === 'C' || sessionStep === 'X')) return false
            const isItNotNumber = (v: any) => isNaN(v)
            if (prevTrack.step === 'R' || prevTrack.step === 'X') {
                if (isItNotNumber(step)) {
                    return true
                } else {
                    if (Number(step) > 0) return true
                }
                return false
            }
            if (isItNotNumber(step)) return true
            return Number(step) > Number(prevTrack.step)
        }
    }

    // useEffect(() => {
    //     console.log('useEffect-dbTrack', dbTrack, prevTrack)
    //     if (!dbTrack) return
    //     if (dbTrack.length > 0 && dbTrack[0].hasOwnProperty('sessions')) {
    //         //A log exists for this fingerprint
    //         const dIdx: number = find_id('dt', dateFormat(null), dbTrack[0].sessions)
    //         let thisTrack = { ...dbTrack[0] }
    //         console.log('useEffect-dbTrack-haslog', dIdx)
    //         if (dIdx === -1) {
    //             //There are no logs for this date, create one.
    //             thisTrack.sessions.push({ dt: dateFormat(null), step: 0, zip: '', phone: '' })
    //             console.log('useEffect-dbTrack-haslog-nodate', thisTrack)
    //             mutateTrack({ ...thisTrack }, dbTrack, false)
    //             setPrevTrack(null)
    //         } else {
    //             //A log exists
    //             console.log('useEffect-dbTrack-haslog-hasdate', prevTrack, thisTrack.sessions[dIdx])
    //             !prevTrack && setPrevTrack(thisTrack.sessions[dIdx])
    //         }
    //     } else {
    //         //No log exists for this fingerprint
    //         console.log('useEffect-dbTrack-nolog!')
    //         mutateTrack({ _id: clientInfo.fingerprint, browser: clientInfo.client, sessions: [{ dt: dateFormat(null), step: 0, zip: '', phone: '' }] }, dbTrack, true)
    //         setPrevTrack(null)
    //     }
    // }, [dbTrack])

    return [doTrack]

}