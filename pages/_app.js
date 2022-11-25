import '@styles/globals.css';
import Navbar from '@components/Navbar';
import { UserContext } from '@lib/context';
import { useUserData } from '@lib/hooks';
import { Toaster } from 'react-hot-toast';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Header/>
      <Component {...pageProps} />
      <Toaster/>
    </UserContext.Provider>
  );
}

export default MyApp;
