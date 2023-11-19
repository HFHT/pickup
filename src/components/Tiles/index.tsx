// import { useState } from "react";
import { useEffect, useState } from 'react';
import './tiles.css';
import { Input } from '../Input';

interface ITiles {
    tiles: Iitems
    chosen?: Iprods
    hasCustom?: string
    customItems: any
    customIdx: number
    setCustomItems: Function
    onClick(e: string, i: number, t: string, b: number): Function | void
}

export const TilesMulti = ({ tiles, chosen, onClick, hasCustom = '', customItems, customIdx, setCustomItems }: ITiles) => {
    const [custom, setCustom] = useState('')

    // console.log('Tiles', tiles, selected, customItems)
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: number, t: string) => {
        // e.type = 'click' (left) = contextmenu (right) e...button = 0 (left) 2 (right) 1 (middle)
        console.log(e.type, e.nativeEvent.button)
        e.preventDefault()
        onClick(e.currentTarget.name, id, t, e.type === 'click' ? 1 : -1)
    }
    function isSelected(l: string) {
        let found = false
        chosen?.forEach((x) => {
            if (x.prod === l) { found = true }
        })
        return found
    }
    function isSelectedQty(l: string) {
        let qty = -1
        chosen?.forEach((x) => {
            if (x.prod === l) { qty = x.qty }
        })
        return qty > 0 ? qty : ''
    }
    function doEmpty() {
        const theCustomItems = [...customItems]
        theCustomItems[customIdx] = ''
        setCustomItems(theCustomItems)
    }
    if (!tiles) alert('Undefined Tile')
    useEffect(() => {
        // console.log('Custom-useEffect', custom, '-', customIdx, customItems)
        if (!custom) return
        const theCustomItems = [...customItems]
        theCustomItems[customIdx] = custom
        setCustomItems(theCustomItems)
    }, [custom])
    //Clear state if a reset has occurred
    useEffect(() => {
        // console.log('Custom-customItems', custom, '-', customIdx, customItems)
        if (customItems.length === 0) {
            setCustom('')
        } else {
            setCustom(customItems[customIdx])
        }
    }, [customItems])

    return (<div>
        <div className="tileGroup">
            {tiles && tiles.map((tileLabel, i) => (
                <div key={i}>
                    <button name={tileLabel.i} onClick={(e) => handleClick(e, i, tileLabel.t)} onContextMenu={(e) => handleClick(e, i, tileLabel.t)} className={(isSelected(tileLabel.i)) ? "tileButton tileactive" : "tileButton"}>
                        {tileLabel.i === ' ' ? '---' : tileLabel.i}
                    </button>
                    <span className={`${isSelectedQty(tileLabel.i) && 'tileqty'}`}>{isSelectedQty(tileLabel.i)}</span>
                </div>
            ))}
        </div>
        {hasCustom && <Input type='text' value={custom} title={`Other...`} onEmpty={() => doEmpty()} onChange={(e: any) => { setCustom(e) }} />}

    </div>
    );

}
