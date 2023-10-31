import { useContext, useState } from 'react';
import './header.css';
import * as logo from '../../assets/HabiStore_logo.webp'

export function Header() {
    console.log(logo)
    return (
        <>
            <div className="headlogo">
                <img src={logo.default} alt='logo'/>
            </div>
            <div className="headtitle">Donation Pickup</div>
            <div className="headbadges">
                {/* <Badge icon={BadgeIcons('Magic')} label='Wizard' content='0' onClick={() => navigate('/')} color='blue' />
                <Badge icon={BadgeIcons('Printer')} label='Barcodes' content='0' onClick={() => navigate('/reprint')} color='blue' /> */}
            </div>
        </>
    )
}