// import { useState } from "react";
import { useState } from 'react';
import './tiles.css';
import { Input } from '../Input';
import { Button } from '../Button';

interface ITile {
    tiles: string[]
    selected?: number | string
    chosen?: Iprods
    hasCustom?: string
    onClick(e: string, i: number): Function | void
}
interface ITiles extends ITile {
    onClear(e: string): Function | void
}

export const Tiles = ({ tiles, onClick, hasCustom = '', selected = -1 }: ITile) => {
    const [custom, setCustom] = useState('')
    // console.log('Tiles', tiles, selected)
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        onClick(e.currentTarget.name, id)
    }
    const handleCustom = (e: string) => {
        setCustom(e);
        onClick(e, tiles.length)
    }
    if (!tiles) alert('Undefined Tile')
    return (
        <div className="tileGroup">
            {tiles && tiles.map((tileLabel, i) => (
                <button key={i} name={tileLabel} onClick={(e) => handleClick(e, i)} className={(selected === i || selected.toString() === tileLabel) ? "tileButton tileactive" : "tileButton"}>
                    {tileLabel === ' ' ? '---' : tileLabel}
                </button>
            ))}
            {hasCustom && <Input type={hasCustom} value={custom} title={''} onChange={(e: any) => handleCustom(e)} />}
        </div>
    );

}

export const TilesMulti = ({ tiles, chosen, onClick, onClear, hasCustom = '', selected }: ITiles) => {
    const [custom, setCustom] = useState('')

    // console.log('Tiles', tiles, selected)
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        onClick(e.currentTarget.name, id)
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
                    <button name={tileLabel} onClick={(e) => handleClick(e, i)} className={(isSelected(tileLabel)) ? "tileButton tileactive" : "tileButton"}>
                        {tileLabel === ' ' ? '---' : tileLabel}
                    </button>
                    <span className={`${isSelectedQty(tileLabel) && 'tileqty'}`}>{isSelectedQty(tileLabel)}</span>
                </div>
            ))}
            {hasCustom && <Input type={hasCustom} value={custom} title={`Other`} onChange={(e: any) => { setCustom(e) }} />}

            {/* {hasCustom && <Input type={hasCustom} value={custom} title={''} onChange={(e: any) => handleCustom(e)} />} */}
        </div>
    );

}
