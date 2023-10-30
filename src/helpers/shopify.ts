import { dateFormat } from "./dateDB";
import { fetchAPI, fetchDB } from "./fetchAPI";

export async function shopifyCustSearch(phone: string) {
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

    const result = await Promise.all(
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
    console.log(result)
    return result
}

export async function shopifyCustAdd(customer: any, appt: any) {
    // customer[0] is fetch results from Shopify, customer[1] is fetch results from Donor DB
    // if customer[0] is set then do an Update to Shopify, otherwise do a Create
    // if customer[1] is set then do nothing, otherwise do a create

    console.log(customer, appt)
    if (customer.length < 2) return
    let options = haveCustomer(customer) ? buildShopifyUpdate(customer[0], appt) : buildShopifyAdd(appt)
    console.log(options)
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
    console.log(result)
}

async function fetchShopify(o: any) {
    try {
        const response = await fetch(`${import.meta.env.VITE_AZURE_FUNC_URL}/api/HFHTShopify`, o);
        console.log(response);
        if (!response.ok) throw `Shopify Item failed with ${response.status}: ${response.statusText}`
        const shopifyResponse = (await response.json());
        console.log(shopifyResponse);
        if (shopifyResponse.hasOwnProperty('theProduct')) {
            return shopifyResponse.theProduct.data
        } else return []
    } catch (error) {
        console.log(error)
        return []
    }
}
function haveCustomer(c: any) {
    return c[0].customers.length > 0
}
function buildShopifyAdd(appt: ISched) {
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
                    "note": `${dateFormat(null)} donated: ${appt.appt.items}`,
                    "tags": 'Pickup',
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

function buildShopifyUpdate(customer: any, appt: ISched) {
    console.log(customer, customer.customers[0])
    let ci: any = {}
    ci.id = customer.customers[0].id
    ci.note = `${customer.customers[0].note} ${dateFormat(null)} donated: ${appt.appt.items}`
    ci.tags = buildTags(customer.customers[0].tags)
    if (!customer.customers[0].email) ci.email = appt.appt.email
    if (!customer.customers[0].last_name) ci.last_name = appt.name.last
    if (!customer.customers[0].first_name) ci.first_name = appt.name.first
    if (customer.customers[0].addresses.length === 0) {
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
                handle: customer.customers[0].id,
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