import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
 
export default class Phone extends React.Component {
    constructor(props:any) {
        super(props);
        this.state = { phone: "" };
    }
    render() {
        return (
            <div>
                <h1>ReactJs Phone Input - GeeksforGeeks</h1>
                <PhoneInput
                    country={'us'}
                    value={this.state.phone}
                    onChange={phone => this.setState({ phone })}
                />
            </div>
        );
    }
};