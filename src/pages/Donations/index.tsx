import { ToastContainer, toast } from "react-toastify";
import { Button } from "../../components/Button";
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import { useEffect, useState } from "react";
import { OpenAI } from "../../components/OpenAI";
interface IDonate {
    isOpen: boolean
    donations: any
    setDonations: Function
    donationInput: any
    setDonationInput: Function
}
export function Donations({ isOpen, donations, setDonations,donationInput, setDonationInput }: IDonate) {
    const [doOpenAI, setDoOpenAI] = useState(false)
    const notify = (t: string) => {
        console.log(t);
        toast.info(t)
    }
    const notify1 = (t: string) => {
        console.log(t);
        toast.success(t, { autoClose: 7000 })
    }
    function handleProducts(curProd: any, i: any, l: any, toast: string, qtyAdjust: number) {
        if (!curProd) return

        let adjust = [...donations]
        let found = false
        console.log('handleProducts', donations, adjust, i, toast, qtyAdjust)
        if (donations.length === 0 && qtyAdjust !== 0) {
            notify1("Adjust quantities using left and right mouse buttons.")
        }
        // Is this a custom product? If so just add it, otherwise check for other attributes.
        if (i > l.length - 1) {
            console.log('Custom')
        } else {
            adjust && adjust.length > 0 && adjust?.forEach((x: any, i: number, o: any) => {
                // console.log(x.prod, e)
                if (x.prod === curProd) {

                    x.qty = x.qty + qtyAdjust;
                    if (x.qty === 0) {
                        o.splice(i, 1)
                    }
                    found = true
                }
            })
            if (!found) {
                adjust?.push({ prod: curProd, qty: 1 })
                if (toast !== '') {
                    notify(toast);
                }
            }
        }
        setDonations([...adjust])
    }

    function handleClear(e: any) {
        console.log('handleClear')
        setDonations([])
    }
    function areItemsEmpty(i: any) {
        // return false if donations.length is greater than zero and there is at leaston one nonblank entry in donations array

    }

    function tryAgain() {

    }
    useEffect(() => {
        console.log('Donations-useEffect', doOpenAI, donationInput)
        if (doOpenAI && donationInput.length === 0) setDoOpenAI(false)
    }, [donationInput])

    return (
        <>
            {isOpen &&
                <>
                    {!doOpenAI &&
                        <>
                            <h4>Provide a list of the items and the quantity of each item, for instance: 1 table, 4 chairs</h4>
                            <div className='donateinput'>
                                <div><textarea value={donationInput} placeholder='1 table, 4 chairs...' className='canceltext' spellCheck rows={5} cols={40} onChange={(e) => { setDonationInput(e.target.value) }} title='Enter a list of items and quantities that you wish to donate.' /></div>
                                {/* <Button onClick={(e: any) => handleClear(e)}>Reset</Button> */}
                                {!doOpenAI && <div><Button disabled={donationInput.length === 0} onClick={() => setDoOpenAI(true)}>Done</Button></div>}
                            </div>
                        </>
                    }
                    <ToastContainer position="top-left" className='mytoast' autoClose={3000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
                    <OpenAI isOpen={doOpenAI} disable={false} userData={donationInput}
                        tryAgain={() => setDoOpenAI(false)}
                        setResult={(e: any) => setDonations(e)} />
                </>
            }
        </>
    )
}
