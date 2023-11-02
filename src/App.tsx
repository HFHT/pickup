import ReactDOM from 'react-dom/client'
import { Main } from './pages/Main'
import './index.css';
import { PageLayout } from './components/PageLayout';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';
import { fetchSAS } from './helpers/fetchAPI';

const queryClient = new QueryClient();
(async () => {
  const sas = await fetchSAS();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryErrorResetBoundary>
      <QueryClientProvider client={queryClient}>
        <APIProvider apiKey={`${import.meta.env.VITE_GOOGLE_APIKEY}`} libraries={['places']}>
          <PageLayout>
            <Main sas={sas} />
          </PageLayout>
        </APIProvider>
      </QueryClientProvider>
    </QueryErrorResetBoundary>
  )
})()