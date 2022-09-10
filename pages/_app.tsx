import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NotificationProvider } from 'web3uikit';
import { MoralisProvider } from 'react-moralis';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  );
}
export default MyApp
