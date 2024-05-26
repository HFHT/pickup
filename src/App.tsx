import './index.css';
import ReactDOM from 'react-dom/client'
// @ts-ignore
import { ClientJS } from 'clientjs'
import { Main } from './pages/Main'
import { Error } from './pages/Error'
import { PageLayout } from './components/PageLayout';
import { APIProvider } from '@vis.gl/react-google-maps';
import { fetchAll, fetchControls, fetchSAS, fetchSchedule, fetchSettings, uniqueBarCode } from './helpers';

(async () => {
  try {
    const sas = await fetchSAS();
    const id = uniqueBarCode()
    let clientJs: any
    clientJs = new (ClientJS)
    const clientInfo: any = {
      fingerprint: clientJs.getFingerprint(),
      client: clientJs.getBrowserData(),
      language: navigator.language
    }
    const fetchTracking = {
      url: `${import.meta.env.VITE_MONGO_URL}?req=${encodeURIComponent(JSON.stringify({ method: 'find', db: 'Truck', collection: 'DonorTracking', find: { _id: clientInfo.fingerprint } }))}`,
      init: {
        method: 'GET',
        headers: new Headers
      }
    }
    const theData = await fetchAll([
      fetchSchedule,
      fetchControls,
      fetchSettings,
      fetchTracking
    ])

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <APIProvider apiKey={`${import.meta.env.VITE_GOOGLE_APIKEY}`} libraries={['places']}>
        <PageLayout>
          {(sas && theData) ? <Main sas={sas} clientInfo={clientInfo} schedule={theData[0]} controls={theData[1]} settings={theData[2]} session={theData[3]} id={id} /> : <Error sas={sas} settings={theData[2]} />}
        </PageLayout>
      </APIProvider>
    )
  } catch (e) {
    console.log('Initialization Error', e);
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <>
        {<h3>&nbsp;Trouble connecting to the HabiStore Pickup Scheduler. You may be experiencing problems with your internet connection. Please try again later.</h3>}
      </>,
    );

  }

})()