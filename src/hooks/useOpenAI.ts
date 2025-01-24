// deprecated model: text-davinci-003

import { useState } from "react";
import { fetchAndSetAll } from "../helpers/fetchAndSetAll";

export function useOpenAI() {
    const [chatItemList, setChatItemList] = useState<[] | null>();
    const [noResponse, setNoResponse] = useState(true);
    const getChatGPT = async (userData: any) => {
        // if (!chatGPT) return;
        console.log(userData)
        if (!userData) return;
        const headers = new Headers();

        const optionsDesc = {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                items: userData,
                prompt: userData,
            })
        };

        try {
            fetchAndSetAll([
                {
                    url: `${import.meta.env.VITE_SCHEDULER_URL}getOpenAI`,
                    init: optionsDesc,
                    setter: checkNoResponse
                }
            ])
        }
        catch (error) { console.log(error); alert('Read of ChatGPT failed, please try again later: ' + error); }
    }

    const resetGPT = (doIt: boolean) => {
        if (!doIt) return
        console.log('resetGPT')
        setChatItemList([])
    }

    const checkNoResponse = (resp: any) => {
        setNoResponse(resp[0].prod === 'Item 1')
        setChatItemList(resp)
    }



    return [chatItemList, getChatGPT, noResponse, resetGPT];
}