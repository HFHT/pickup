import { useState, useEffect } from "react";
import './input.css';
import { dateFormat } from "../../helpers/dateDB";

interface IInput {
    type: string;
    inputMode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal" | undefined;
    value: string | number;
    title: string;
    setter?: Function;          // State is controlled locally and only sent on Enter or Blur
    onChange?: Function;        // State is controlled externally 
    onEmpty?: Function;
    error?: Function;
    defaultValue?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    enterKey?: boolean;
    textOnly?: boolean;
    required?: boolean;
    spellCheck?: boolean;
    autoComplete?: string[];
    isURL?: boolean;
    isNumber?: boolean;
    size?: number;
    max?: number | string;
    min?: number | string;
    maxLength?: number;
    minLength?: number;
    classes?: string;
}

interface IVal {
    value: string | number;
    event: any;
}

export function Input(
    { type, value, inputMode, title, setter, onChange, onEmpty, error, defaultValue, autoFocus, disabled, enterKey = true, textOnly, required, autoComplete,
        isURL, isNumber, size, max, min, maxLength, minLength, spellCheck, classes
    }: IInput) {

    //export function Input(props: IInput) {
    const regexUrl = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
    const regexNum = new RegExp(/^\d+$/);
    const [theValue, setTheValue] = useState<IVal>({ value: value, event: {} });
    const [errText, setErrText] = useState('');
    const [spanTitle, setSpanTitle] = useState('');
    const displayTitle = title + (required ? ' *' : '');
    const textTitle = title ? `${title}: ` : '';
    const handleChange = (inputValue: any, e: any) => {
        // console.log(inputValue, e);
        if (onChange) {
            onChange(inputValue);
        } else {
            setTheValue({ value: inputValue, event: e });
        }
        setSpanTitle((inputValue.length > 0 || type === 'date') ? displayTitle : '');
    }
    const handleEnter = (e: any) => {
        console.log('enter', enterKey);
        if (enterKey) {
            (typeof setter !== 'undefined' ) && setter(theValue.value);
            setTheValue({ value: value, event: e });
        }
    }
    const handleBackspace = (e: any) => {
        // console.log(e.code, value)
        if (value.toString().length === 0) (typeof onEmpty !== 'undefined') && onEmpty();
    }
    const handleBlur = (e: any) => {
        // setter && errText === '' && setter(theValue.value)
        (typeof setter !== 'undefined' ) && setter(theValue.value)
    }

    useEffect(() => {
        ((value && value.toString().length > 0) || type === 'number' || type === 'date' || disabled) && setSpanTitle(title);
        value !== theValue.value && setTheValue({ value: value, event: {} });
    }, [value]);

    useEffect(() => {
        // console.log('Input-useEffect-theValue', theValue);
        validate();
        // if (Object.keys(theValue.event).length !== 0) { validate() };
    }, [theValue]);

    useEffect(() => {
        ((value && value.toString().length > 0) || type === 'number' || type === 'date' || disabled) && setSpanTitle(title);
        validate();
    }, []);

    // console.log('Input render');

    return (
        <>
            <div className="">
                {textOnly &&
                    <span className="text-sm">{`${textTitle} ${theValue}`}</span>}
                {!textOnly &&
                    <label className="text-sm">
                        <span className={`text-sm label-span`}>
                            {spanTitle}<span>&#8203;</span>
                        </span>
                        <input
                            type={type}
                            value={type === 'date' ? dateFormat(theValue.value) : theValue.value}
                            inputMode={inputMode}
                            placeholder={displayTitle}
                            defaultValue={defaultValue}
                            spellCheck={spellCheck}
                            alt={title}
                            disabled={disabled} autoFocus={autoFocus} required={required} size={size}
                            min={min} max={max} minLength={minLength} maxLength={maxLength}
                            onChange={(e) => handleChange(e.target.value, e)}
                            onKeyUp={(e) => { e.code === 'Backspace' && handleBackspace(e); e.code === 'Enter' && handleEnter(e) }}
                            onBlur={(e) => handleBlur(e)}
                            className={`${errText !== '' && 'inputerr'} ${classes}`}>
                        </input>
                        <span className={`${errText === '' && 'hidden'} text-sm input-err-text`}>{errText}<span>&#8203;</span></span>
                    </label>}
            </div>
        </>
    );

    //type of text: required isUrl minLen maxLen isNumber
    //type of number: required minVal maxVal minLen maxLen
    //type of date: required minVal maxVal
    //set border color to red
    function validate() {
        let theErr = '';
        const isEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

        // console.log(theValue.value);
        // console.log(required, theValue.value.toString().length)
        if (theValue.value) {
            if (type === 'text') {
                // console.log(isURL, theValue.value.toString(), theValue.value.toString().length);
                isURL && theValue.value.toString().length > 0 && !theValue.value.toString().match(regexUrl) && (theErr = 'invalid URL');
                isNumber && !theValue.value.toString().match(regexNum) && (theErr = 'number');
                minLength && theValue.value.toString().length < minLength && (theErr = 'too short');
                maxLength && theValue.value.toString().length > maxLength && (theErr = 'too long');
            } else {
                if (type === 'number') {
                    if (min && theValue.value < min) { theErr = 'min Value' };
                    if (max && theValue.value > max) { theErr = 'max Value' };
                    minLength && theValue.value.toString().length < minLength && (theErr = 'too short');
                    maxLength && theValue.value.toString().length > maxLength && (theErr = 'too long');
                } else {
                    if (type === 'date') {
                        min && theValue.value < min && (theErr = 'min Value');
                        max && theValue.value > max && (theErr = 'max Value');
                    } else {
                        if (type === 'email' && !isEmail(theValue.value.toString())) {
                            theErr = 'Email address invalid';
                        }
                    }
                }
            }
            required && theValue.value.toString().length < 1 && (theErr = 'required');
        } else {
            required && (theErr = 'required');
        }
        // console.log('Input-theErr', theErr);
        setErrText(theErr);
        theErr !== '' && error && error(theErr);
    }
}