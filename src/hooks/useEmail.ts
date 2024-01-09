//{to:'xyz@xyz.com', subject:'Hi', text:'Just saying hi', html: '<h1>Hi There!</h1>}

import { useState } from "react";
import { CONST_EMAILS } from "../constants";
import { fetchAndSetAll } from "../helpers/fetchAndSetAll";


export function useEmail(toast: Function) {
    const [noResponse, setNoResponse] = useState(true);


    const sendEMail = async (name:{first:string, last:string}, addr: string | undefined, email: string, template: { subject: string, body: string }) => {
        // if (!chatGPT) return;
        console.log('sendEmail', email, template)
        if (!email) return;
        const headers = new Headers();
        return //TEMP!!!! wait till email domain is linked and then remove.
        const optionsDesc = {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                to: email,
                subject: template.subject,
                html: template.body,
                text: ''
            })
        };

        try {
            fetchAndSetAll([
                {
                    url: `${import.meta.env.VITE_AZURE_FUNC_URL}/api/HFHTSendEmail`,
                    init: optionsDesc,
                    setter: checkNoResponse
                }
            ])
        }
        catch (error) { console.log(error); toast('Send of email failed: ' + error); }
    }

    const checkNoResponse = (resp: any) => {
        setNoResponse(resp[0].prod === 'Item 1')
    }

    return [sendEMail, noResponse] as const;

}
