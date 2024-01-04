import { useState } from "react";

import { BlockBlobClient, AnonymousCredential } from "@azure/storage-blob";

export function useImageUpload() {
    const [imageDone, setImageDone] = useState('');
    const [imageProgress, setImageProgress] = useState(0);
    const [imageErr, setImageErr] = useState({ hasError: false, errDesc: '' });
    const blobClientErrors = ['RestError: This request is not authorized to perform blob overwrites.'];

    function doUpload(file: any, name:string, sas: any) {
        console.log('imageUpload:', file, typeof file)
        console.log('Sas key:', sas.url, sas.sasKey)
        
        const container = 'habistorepickup'
        var blobName = name
        var login = `${sas.url}/${container}/${blobName}?${sas.sasKey}`;
        var blockBlobClient = new BlockBlobClient(login, new AnonymousCredential)
        const reader = new FileReader()
        reader.onload = () => {
            console.log('Reader result', reader.result)
            console.log('Reader', reader)
            //@ts-ignore
            blockBlobClient.uploadData(reader.result)
                .then(() => setImageDone(`${sas.url}/habistorepickup/${name}`))
                .catch((e) => {
                    //alert(e);
                    setImageErr({ hasError: true, errDesc: e });
                })
                .finally(() => { });
        }
        reader.onprogress = (data: ProgressEvent) => {
            if (data.lengthComputable) {
                setImageProgress(((data.loaded / data.total) * 100))
            }
        }
        reader.onabort = () => setImageErr({ hasError: true, errDesc: 'Abort' });
        reader.onerror = () => setImageErr({ hasError: true, errDesc: 'Error' });
        reader.readAsArrayBuffer(file)
    }

    return [doUpload, imageProgress, imageDone, imageErr] as const;

}
