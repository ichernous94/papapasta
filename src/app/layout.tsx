import { lato, notoSans, openSans, roboto } from '@/config/fonts';
import '@/styles/index.scss';

// REACT QUERY PROVIDER
import ReactQueryProvider from '@/services/ReactQueryProvider';

// TOASTIFY
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl-PL">
      <body
        className={`${lato.variable} ${openSans.variable} ${roboto.variable} ${notoSans.variable}`}
      >
        <ReactQueryProvider>
          <ToastContainer />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
