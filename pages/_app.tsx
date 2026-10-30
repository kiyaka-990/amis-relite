import type { AppProps } from 'next/app';
import { PreferencesProvider } from '../components/PreferencesProvider';
import { ContentProvider } from '../components/ContentProvider';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PreferencesProvider>
      <ContentProvider>
        <Component {...pageProps} />
      </ContentProvider>
    </PreferencesProvider>
  );
}
