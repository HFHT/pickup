import './index.css';
import ReactDOM from 'react-dom/client'
//@ts-ignore
import { ClientJS } from 'clientjs'
import { Main } from './pages/Main'
import { Error } from './pages/Error'
import { PageLayout } from './components/PageLayout';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';
import { fetchAPI, fetchSAS, uniqueBarCode } from './helpers';

const queryClient = new QueryClient();
(async () => {
  const sas = await fetchSAS();
  const settings = await fetchAPI({ req: { method: 'find', db: 'Truck', collection: 'Settings' }, isObj: true });
  const id = uniqueBarCode()
  let clientJs: any
  clientJs = new (ClientJS)
  const clientInfo: any = {
    fingerprint: clientJs.getFingerprint(),
    client: clientJs.getBrowserData(),
    language: navigator.language
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryErrorResetBoundary>
      <QueryClientProvider client={queryClient}>
        <APIProvider apiKey={`${import.meta.env.VITE_GOOGLE_APIKEY}`} libraries={['places']}>
          <PageLayout>
            {(sas && settings) ? <Main sas={sas} clientInfo={clientInfo} settings={settings} id={id} /> : <Error sas={sas} settings={settings} />}
          </PageLayout>
        </APIProvider>
      </QueryClientProvider>
    </QueryErrorResetBoundary>
  )
})()