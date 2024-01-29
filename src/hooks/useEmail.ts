//{to:'xyz@xyz.com', subject:'Hi', text:'Just saying hi', html: '<h1>Hi There!</h1>}

import { CONST_IMAGE_EMAIL } from "../constants";

export interface ISendMail {
    email: IEmail,
    list: Iitem[]
    listAll: boolean
    images?: string[] | undefined
    template: {
        subject: string
        body: string
    }
}
interface IEmail {
    name: { first: string, last: string },
    addr: string | undefined
    note: { apt: string, note: string }
    email: string
    date: string
    time: string
}
export function useEmail(toast: Function) {

    const sendEMail = async ({ email, list, listAll, images = [], template }: ISendMail) => {
        // if (!chatGPT) return;
        console.log('sendEmail', email, template)
        if (!email) return;

        const headers = new Headers();
        const optionsDesc = {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                to: email.email,
                subject: template.subject,
                html: formatTemplate({ email, list, listAll, images, template }),
                text: ''
            })
        };
        console.log('sendEmail', optionsDesc.body)

        fetch(`${import.meta.env.VITE_AZURE_FUNC_URL}/api/HFHTSendEmail`, optionsDesc)
            .then(response => { 
                console.log(response); 
                !response.ok && alert('There is a problem with the network, confirmation email not sent. Please try again later.')
            })
            .catch(error => { console.log(error); })
    }

    return [sendEMail] as const;

    function formatTemplate({ email, list, listAll, images, template }: ISendMail) {
        let theResult = template.body
        theResult = theResult.replace(/{DATE}/g, email.date).replace(/{TIME}/g, email.time === '' ? '9AM-3PM' : email.time).replace(/{ADDRESS}/g, formatAddr(email)).replace(/{NOTES}/g, formatNote(email))
        theResult = theResult.replace(/{LIST}/g, buildList(list, listAll))
        theResult = theResult.replace(/{IMAGES}/g, buildImages(images))
        theResult = theResult.replace(/{NAME}/g, `${email.name.first} ${email.name.last}`)
        return theResult
    }
    function formatNote(email: IEmail) {
        return (email.note.note === '') ? '' : `Note: ${email.note.note}`
    }
    function formatAddr(email: IEmail) {
        if (!email.addr || email.addr === '') return ''
        if (email.note.apt !== '') return `${email.addr}  unit: ${email.note.apt}`
        return email.addr
    }
    function buildList(theList: Iitem[], listAll: boolean) {
        let retList = theList.length > 0 ? '<ul compact>' : ''
        theList.forEach((theItem: Iitem) => {
            if (listAll || theItem.c) {
                retList = `${retList} <li>${theItem.qty}-${theItem.prod}</li>`
            }
        })
        retList = `${retList} ${theList.length > 0 ? '</ul>' : ''}`
        return retList
    }
    function buildImages(theImages: string[] | undefined) {
        console.log(theImages)
        let retImages = ''
        if (theImages && theImages.length > 0) {
            retImages = `${CONST_IMAGE_EMAIL} `
            theImages.forEach((theImage: string) => {
                retImages = `${retImages} <a href="${import.meta.env.VITE_STORAGEIMAGEURL}${theImage}" ><img src="${import.meta.env.VITE_STORAGEIMAGEURL}${theImage}" height="200px"/></a>`
            })
        }
        return retImages
    }
}


