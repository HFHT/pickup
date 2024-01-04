import { CONST_SHOPIFY_TAG } from "../constants";
import { dateFormat } from "./dateDB";
import { fetchAPI, fetchDB } from "./fetchAPI";

export async function shopifyCustSearch(phone: string) {
    //lookup the phone number in Shopify and in the local db
    //returns [theAddress from db or Shopify or null, Shopify customer record or null]
    if (!phone) return;
    console.log(phone)
    let options = {
        method: "POST",
        headers: new Headers(),
        body: JSON.stringify({
            method: 'searchCust',
            product: `phone=${phone}`
        })
    };

    const result: any = await Promise.all(
        [
            fetchShopify(options),
            fetchAPI({
                isObj: true,
                req: {
                    method: 'find', db: 'Truck',
                    collection: 'Donors', find: { _id: phone }
                }
            })
        ])
    console.log(result, result[0].customers, result[1])

    return [hasLocalEntry(result), hasShopifyEntry(result)]

    function hasLocalEntry(thisResult: any) {
        if (thisResult[1] && thisResult[1].length > 0) {                  // There is an address in local db
            return thisResult[1][0]
        }
        switch (thisResult[0].customers.length) {
            case 0:                                             // Phone number not in Shopify
                return null
            case 1:                                             // One customer record for this phone number
                return formatDonor(thisResult[0].customers[0])
            default:                                            // More than one, find the best one.
                let hasAddr = thisResult[0].customers.filter((rcd: any) => {
                    return rcd.addresses.length > 0
                })
                console.log(hasAddr)
                return formatDonor(hasAddr[0])
        }
    }
    function hasShopifyEntry(thisResult: any) {
        switch (thisResult[0].customers.length) {
            case 0:                                             // Phone number not in Shopify
                return null
            case 1:                                             // One customer record for this phone number
                return thisResult[0].customers[0]
            default:                                            // More than one, find the best one.
                let hasAddr = thisResult[0].customers.filter((rcd: any) => {
                    return rcd.addresses.length > 0
                })
                console.log(hasAddr)
                return hasAddr[0]
        }
    }

    function formatDonor(shopifyCust: any) {
        let streetParts = shopifyCust.default_address.address1.split(' ')
        let streetNum = streetParts.splice(0, 1)
        return {
            _id: shopifyCust.phone, apt: '', dt: dateFormat(null), email: shopifyCust.email, nt: '',
            name: { first: shopifyCust.first_name, last: shopifyCust.last_name },
            addr: {
                addr: shopifyCust.default_address.address1,
                lat: 0,
                lng: 0,
                num: streetNum[0],
                route: streetParts.join(' '),
                city: shopifyCust.default_address.city,
                state: shopifyCust.default_address.province_code,
                c_cd: shopifyCust.default_address.country_code,
                c_nm: shopifyCust.default_address.country_name,
                zip: shopifyCust.default_address.zip
            }
        }
    }
}

export async function shopifyCustAdd(customer: any, appt: any) {
    // customer[1] has Shopify customer info, if null then need to create, otherwise update
    console.log('shopifyCustAdd', customer, appt)
    if (!customer || customer.length === 0) return
    let options = haveCustomer(customer) ? buildShopifyUpdate(customer[1], appt) : buildShopifyAdd(appt)
    console.log('shopifyCustAdd-options', options)
    // handle where email is already taken by another record.

    const result = await Promise.all(
        [
            fetchShopify(options),
            fetchAPI({
                isObj: true,
                req: {
                    method: 'updateOne', db: 'Truck',
                    collection: 'Donors', find: { _id: appt.phone },
                    data: {
                        _id: appt.phone,
                        name: appt.name,
                        addr: appt.place,
                        apt: appt.appt.apt,
                        nt: appt.appt.note,
                        email: appt.appt.email,
                        dt: dateFormat(null)
                    }
                }
            })
        ])
    console.log('shopifyCustAdd-result', result)
}

async function fetchShopify(o: any) {
    try {
        const response = await fetch(`${import.meta.env.VITE_AZURE_FUNC_URL}/api/HFHTShopify`, o);
        console.log('fetchShopify', response);
        if (!response.ok) throw `Shopify Item failed with ${response.status}: ${response.statusText}`
        const shopifyResponse = (await response.json());
        console.log('fetchShopify', shopifyResponse);
        if (shopifyResponse.hasOwnProperty('theProduct')) {
            return shopifyResponse.theProduct.data
        } else return []
    } catch (error) {
        console.log('fetchShopify', error)
        return []
    }
}
function haveCustomer(c: any) {
    console.log('haverCustomer', c, c[1])
    return c[1] !== null
}
function buildShopifyAdd(appt: ISched) {
    console.log('buildShopifyAdd', appt)
    return {
        method: "POST",
        headers: new Headers(),
        body: JSON.stringify({
            method: 'addCust',
            product: JSON.stringify({
                "customer": {
                    "first_name": appt.name.first,
                    "last_name": appt.name.last,
                    "email": appt.appt.email,
                    "phone": appt.phone,  // +15142546011
                    "verified_email": false,
                    "note": `${appt.note && appt.note} ${dateFormat(null)} donated: ${itemsToList(appt.items)}. `,
                    "tags": `${CONST_SHOPIFY_TAG}`,
                    "addresses": [
                        {
                            "address1": `${appt.place.num} ${appt.place.route}`,
                            "address2": appt.appt.apt,
                            "city": appt.place.city,
                            "province": appt.place.state,  // State
                            "phone": appt.phone,
                            "zip": appt.place.zip,
                            "last_name": appt.name.last,
                            "first_name": appt.name.first,
                            "country": "US"
                        }
                    ],
                    "send_email_welcome": false
                }
            })
        })
    }
}

function itemsToList(theItems: any) {

    return theItems.map((ti: any) => (
        ti.qty === 0 ? `${ti.prod}` : `${ti.prod}(${ti.qty})`
    ))
}
function buildShopifyUpdate(customer: any, appt: ISched) {
    console.log('buildShopifyUpdate', customer, appt)
    let ci: any = {}
    ci.id = customer.id
    ci.note = `${customer.note && customer.note} ${dateFormat(null)} donated: ${itemsToList(appt.items)}. `
    ci.tags = `${CONST_SHOPIFY_TAG}` /*buildTags(customer.tags)*/
    if (!customer.email) ci.email = appt.appt.email
    if (!customer.last_name) ci.last_name = appt.name.last
    if (!customer.first_name) ci.first_name = appt.name.first
    if (customer.addresses.length === 0) {
        ci.addresses = [
            {
                "address1": `${appt.place.num} ${appt.place.route}`,
                "city": appt.place.city,
                "province": appt.place.state,  // State
                "phone": appt.phone,
                "zip": appt.place.zip,
                "last_name": appt.name.last,
                "first_name": appt.name.first,
                "country": "US"
            }
        ]
    }

    return {
        method: "POST",
        headers: new Headers(),
        body: JSON.stringify({
            method: 'updateCust',
            product: {
                handle: customer.id,
                body: JSON.stringify({
                    "customer": ci
                })
            }

        })
    }
}
function buildTags(ts: string) {
    let t = ts.split(',')
    if (t.find((f: string) => f === 'Pickup')) {
        return ts
    } else {
        return t.push('Pickup').toString()
    }
}