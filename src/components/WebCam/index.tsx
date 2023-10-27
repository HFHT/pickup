import './webcam.css';

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from '../Button';

interface ICamera {
    imgUrl?: string;
    setter: Function;
}

export const WebcamCapture = ({ imgUrl, setter }: ICamera) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(imgUrl);
    const [cam, toggleCam] = useState(true);

    const capture = useCallback(() => {
        if (!webcamRef) return
        if (!webcamRef.current) return
        //@ts-ignore
        const imageSrc = webcamRef.current.getScreenshot({ width: 800, height: 800 });
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

    const saveimg = () => {
        if (!imgSrc) return;
        setter(imgSrc);
    }

    return (
        <div className='phototop'>
            <div>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ width: 400, height: 400, facingMode: setCamera() }}
                />
                <div className='photocontrols'>
                    <Button onClick={() => toggleCam(!cam)} classes='photobtn'>Camera</Button>
                    <Button onClick={capture} classes='photobtn'>Photo</Button>
                    <Button onClick={saveimg} classes='photobtn'>&nbsp;&nbsp;OK&nbsp;</Button>
                </div>
            </div>
            <div>
                {imgSrc && (
                    <img alt='' width='400'
                        src={imgSrc}
                    />
                )}
            </div>
        </div>
    );
    function setCamera() {
        if (!cam) return {}
        return { exact: "environment" }
    }
};


// https://www.npmjs.com/package/react-webcam
