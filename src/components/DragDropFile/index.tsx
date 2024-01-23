import { CONST_NOTSUPPORTED_IMAGES, CONST_NOTSUPPORTED_IMG } from '../../constants';
import { fileType } from '../../helpers';
import { handleBrokenImage } from '../../helpers/handleBrokenImage';
import './dragdropfile.css';
import { useState, useRef } from 'react';

export interface Iimg {
    name: string;
    url: string;
    blob: any;
}
export interface Iimgs extends Array<Iimg> { }

interface IDrag {
    images: Iimgs;
    setImages: Function;
    title: string;
}

export function DragDropFile({ images, setImages, title }: IDrag) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInput = useRef(null)

    function selectFiles() {
        //@ts-ignore
        fileInput.current.click()
    }
    function onFileSelect(event: any) {
        const files = event.target.files;
        if (files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== 'image') continue
            if (!images.some((e: any) => e.name === files[i].name)) {
                setImages((prevImages: any) => [
                    ...prevImages,
                    {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                        blob: files[i]
                    }
                ])
            }
        }
    }
    function deleteImage(idx: number) {
        setImages((prevImages: any) =>
            prevImages.filter((_: any, i: number) => i !== idx)
        )
    }
    function onDragOver(event: any) {
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect = 'copy'
    }
    function onDragLeave(event: any) {
        event.preventDefault();
        setIsDragging(false)
    }
    function onDrop(event: any) {
        event.preventDefault();
        setIsDragging(false)
        const files = event.dataTransfer.files
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== 'image') continue
            if (!images.some((e: any) => e.name === files[i].name)) {
                setImages((prevImages: any) => [
                    ...prevImages,
                    {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                        blob: files[i]
                    }
                ])
            }
        }
    }
    return (
        <div className="card">
            <div className="top">
                <p>{title}</p>
            </div>
            <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging ?
                    (
                        <span className="select">
                            Drop images here
                        </span>
                    ) : (
                        <>
                            Drag & Drop image here or {" "}
                            <span className="select" role="button" onClick={selectFiles}>
                                Browse
                            </span>
                        </>

                    )}
                <input name='file' type='file' multiple ref={fileInput} onChange={onFileSelect} title='file'></input>
            </div>
            <div className="container">
                {
                    images.map((image: any, idx) => (
                        <div className="image" key={idx}>
                            <span className="delete" onClick={() => deleteImage(idx)}>&times;</span>
                            <img
                                src={CONST_NOTSUPPORTED_IMAGES.includes(fileType(image.name)) ? CONST_NOTSUPPORTED_IMG :image.url}
                                onError={(e) => handleBrokenImage(e)}
                                alt={image.name}
                            />
                        </div>
                    )

                    )
                }
            </div>
        </div>
    )
}