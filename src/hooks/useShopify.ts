import { useState } from "react";
import { CONST_DISCOUNTS } from "../constants";
import { uniqueBarCode } from "../helpers/barCode";

export function useShopify() {
    // const [theCollections, setTheCollections] = useState()
    const [isDone, setIsDone] = useState('')

    const headers = new Headers();
    var url = `${import.meta.env.VITE_AZURE_FUNC_URL}/api/HFHTShopify`;

    const doShopify = async (prompt: Itype, collections: any, featured: string = 'submit', isSku: boolean = false) => {
        if (!prompt.result.room) return;
        console.log('useShopify', prompt)

        let options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                method: 'add',
                collections: prepareCollections(collections, prompt, featured, isSku),
                product: JSON.stringify({
                    "product": {
                        "title": prompt.barcode.slice(-5) + ' ' + prompt.result.desc[0],
                        "published_scope": featured === 'submit' ? "201136242996" : "global",
                        "body_html": prompt.result.desc[1],
                        "vendor": currentDiscount(),
                        "product_type": prompt.result.col[0],
                        "status": "active",
                        "tags": [prompt.result.seo, prompt.result.room, prompt.result.prod, prompt.result.src],
                        "variants": [{
                            "barcode": prompt.hasOwnProperty('barcode') ? prompt.barcode : uniqueBarCode(),
                            "sku": prompt.hasOwnProperty('sku') ? prompt.sku : '',
                            "compare_at_price": prompt.result.price,
                            "price": prompt.result.price,
                            "requires_shipping": true,
                            "taxable": false,
                            "inventory_management": "shopify",
                            "inventory_policy": "deny",
                            "inventory_quantity": prompt.hasOwnProperty('invQty') ? prompt.invQty : 1,
                            "weight_unit": "kg",
                            "grams": 0,
                            "weight": 0
                        }]
                    }
                })
            })
        };
        try {
            const response = await fetch(url, options);
            console.log(response);
            if (!response.ok) throw `Shopify Item failed with ${response.status}: ${response.statusText}`
            const shopifyResponse = (await response.json());
            console.log(shopifyResponse, shopifyResponse.prodId);
            if (shopifyResponse.hasOwnProperty('prodId')) {
                url = `${import.meta.env.VITE_AZURE_FUNC_URL}/api/HFHTShopifyImage`;

                options.body = JSON.stringify({
                    method: 'image',
                    product: shopifyResponse.prodId,
                    body: prepareImage(1, prepareTitle(prompt), prompt.imgs.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""))
                })

                const imageResponse = await fetch(url, options);
                console.log(imageResponse);
                if (!imageResponse.ok) throw `Shopify Image upload failed with ${imageResponse.status}: ${imageResponse.statusText}`
                const shopifyImgResponse = (await imageResponse.json());
                setIsDone(shopifyImgResponse)
                console.log(shopifyImgResponse);
            } else {
                throw 'Upload to Shopify failed, try again later!'
            }

        }
        catch (error) {
            console.log(error);
            alert(error);
        }
    }
    return [doShopify, isDone];


    function prepareOptions(method: string, collections: [], product: any) {
        return ({
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                method: method,
                collections: collections.length > 0 ? collections : '',
                product: product !== '' ? JSON.stringify(product) : ''
            })
        });
    }

    function prepareImage(imageNo: number, alt: string, img: string) {
        let theImg = {}
        console.log(img.slice(0, 8))
        if (img.slice(0, 8) === 'https://') {
            theImg = {
                image: {
                    position: imageNo,
                    metafields: [
                        { key: 'new', value: 'newvlue', type: 'single_line_text_field', namespace: 'global' }
                    ],
                    src: img,
                    alt: alt,
                    filename: `H${uniqueBarCode()}.png`
                }
            }
        } else {
            theImg = {
                image: {
                    position: imageNo,
                    metafields: [
                        { key: 'new', value: 'newvlue', type: 'single_line_text_field', namespace: 'global' }
                    ],
                    attachment: img,
                    alt: alt,
                    filename: `H${uniqueBarCode()}.png`
                }
            }
        }
        return (
            JSON.stringify(theImg)
        )
    }

    function prepareCollections(theCollections: any, result: any, featured: string, isSku: boolean) {
        if (!theCollections) return []
        var aryCol = [
            theCollections.collections[isSku ? 'purchased-products' : 'newly-added-items'],
            theCollections.collections[currentDiscount()]
        ]
        featured === 'treasure' && (aryCol.push(theCollections.collections['featured-items']))
        console.log(theCollections)
        console.log(aryCol)
        result.result.col.forEach((c: string) => {
            aryCol.push(theCollections.collections[c])
        })
        console.log(aryCol)
        return aryCol
    }

    function currentDiscount() {
        var theDiscounts = CONST_DISCOUNTS
        theDiscounts = theDiscounts.concat(CONST_DISCOUNTS)
        theDiscounts = theDiscounts.concat(CONST_DISCOUNTS)
        const theMonth = new Date().getMonth()
        console.log(theDiscounts, theMonth, theDiscounts[theMonth])
        return theDiscounts[theMonth]
    }

    function prepareTitle(theItem: Itype) {
        const theAttrs = `${theItem.result.seo} ${theItem.result.finish} ${theItem.result.attr1}`
        let theTitle = '';
        if (theItem.result.prod || theItem.result.prods.length == 1) {
            theTitle = `${theAttrs} ${theItem.result.prod} ${theItem.result.prods[0].prod}`
        } else {
            theTitle = `${theItem.result.prods.length} piece ${theAttrs} ${theItem.result.room} set`
        }
        if (theItem.result.qty && theItem.result.qty > -1) {
            theTitle = `${theTitle} (${theItem.result.qty} Sq Ft)`
        }
        return theTitle.replace(/\s+/g, ' ').trim()
    }
}
