// import { useState } from "react";
import { useState } from 'react';
import './tiles.css';
import { Input } from '../Input';
import { Button } from '../Button';

interface ITiles {
    tiles: Iitems
    selected?: number | string
    chosen?: Iprods
    hasCustom?: string
    onClick(e: string, i: number, t: string): Function | void
    onClear(e: string): Function | void

}

export const TilesMulti = ({ tiles, chosen, onClick, onClear, hasCustom = '', selected }: ITiles) => {
    const [custom, setCustom] = useState('')

    // console.log('Tiles', tiles, selected)
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: number, t: string) => {
        onClick(e.currentTarget.name, id, t)
    }
    // const handleCustom = (r: string) => {
    //     console.log('handleCustom', r, custom)
    //     // setCustom(e);
    //     onClick(custom, tiles.length)
    //     setDisabled(true)
    // }
    function isSelected(l: string) {
        let found = false
        chosen?.forEach((x) => {
            // console.log(x.prod, l)
            if (x.prod === l) { found = true }
        })
        return found
    }
    function isSelectedQty(l: string) {
        let qty = -1
        chosen?.forEach((x) => {
            // console.log(x.prod, l)
            if (x.prod === l) { qty = x.qty }
        })
        return qty > 0 ? qty : ''
    }
    if (!tiles) alert('Undefined Tile')
    return (
        <div className="tileGroup">
            {tiles && tiles.map((tileLabel, i) => (
                <div key={i}>
                    <button name={tileLabel.i} onClick={(e) => handleClick(e, i, tileLabel.t)} className={(isSelected(tileLabel.i)) ? "tileButton tileactive" : "tileButton"}>
                        {tileLabel.i === ' ' ? '---' : tileLabel.i}
                    </button>
                    <span className={`${isSelectedQty(tileLabel.i) && 'tileqty'}`}>{isSelectedQty(tileLabel.i)}</span>
                </div>
            ))}
            {hasCustom && <Input type={hasCustom} value={custom} title={`Other`} onChange={(e: any) => { setCustom(e) }} />}

            {/* {hasCustom && <Input type={hasCustom} value={custom} title={''} onChange={(e: any) => handleCustom(e)} />} */}
        </div>
    );

}
