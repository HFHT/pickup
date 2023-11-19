import './openai.css';

import { useEffect, useState } from "react"
import { Button } from "../Button"
import { CONST_GPT_PROMPT, CONST_acceptedProducts } from '../../constants';
import { useOpenAI } from '../../hooks/useOpenAI';

interface ITile {
    isOpen: boolean
    disable: boolean
    userData: string
    setResult: Function
}

export const OpenAI = ({ isOpen, disable, userData, setResult }: ITile) => {
    const [isChat, setIsChat] = useState(false)
    const [itemList, getGPT, noResponse, resetGPT]: any = useOpenAI()

    useEffect(() => {
        if (isOpen && userData !== '') {
            console.log('getOpenAI', userData)
            getGPT(buildPrompt())
        }
    }, [isOpen])

    function getOpenAI() {
        console.log('getOpenAI', userData)
        getGPT(buildPrompt())
        setIsChat(true)
    }
    function handleAccept() {
        setResult(itemList)
        resetGPT(true)
    }
    function checkItems(theItem: any) {
        console.log(theItem)
        let resp = CONST_acceptedProducts.find((ti: any) => (
            (ti.i).toUpperCase() === theItem.toUpperCase()) || ((`${ti.i}s`).toUpperCase() === theItem.toUpperCase()))?.t
        console.log(resp)            
        return resp ? `- ${resp}` : null
    }

    return (
        <div className='aimain'>
            {isOpen &&
                <>

                    <div className='aicontrols'>
                        <Button onClick={() => getOpenAI()} disabled={disable} classes='aibutton'>Update</Button>
                        <Button onClick={() => handleAccept()} disabled={noResponse} classes='aibutton'>&nbsp;&nbsp;Confirm&nbsp;</Button>
                    </div>
                    <div className="aitext">
                        {noResponse ?
                            <div>I did not understand your list. Please make sure it has a quantity along with the item.</div>
                            :
                            <>
                                <div>Here is what I think you are donating:<br /><br /></div>
                                <div className='airesults'>
                                    {
                                        itemList && itemList.length > 0 && itemList.map((ti: any, k: number) => (
                                            <ResultRow key={k} r={ti} />
                                        ))
                                    }
                                </div>
                            </>
                        }
                    </div>
                </>
            }
        </div>
    );

    function ResultRow({ r }: any) {
        console.log(r)
        return (
            <div className='airdiv'>
                <div className='airow'>
                    {r.qty === 0 ? `${r.prod}` : `${r.qty} ${r.prod}`}
                </div>
                <div className='airmsg'>
                    {checkItems(r.prod)}
                </div>
            </div>
        )
    }
    function buildPrompt() {
        return CONST_GPT_PROMPT.replace(/{items}/g, userData)
    }
}

