import Layout from '@components/Layout';
import '../styles/globals.css'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "../store";
import axios from 'axios';
import { ArrowCircleUpIcon } from '@heroicons/react/outline'
import { ArrowUpIcon } from '@heroicons/react/solid';
import React, { useEffect } from 'react';
import { SessionProvider } from "next-auth/react"
import { getCsrfToken, getProviders, signIn, useSession, signOut } from "next-auth/react"
import { Router } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
const https = require('https');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})
const { store, persistor } = configureStore();
// import Layout from '@components/Layout'
axios.defaults.httpsAgent = httpsAgent;
axios.defaults.baseURL = process.env.API_URL;
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      store.dispatch({
        type: 'clear_all',
      });
      if (error.response?.data?.error?.message?.includes('is social')) {

      } else {
        window.location.href = '/login';
      }
      // 
    }
    throw error;
  }
);

// function MyApp({ Component, pageProps: { session, ...pageProps } }) {
//   useEffect(() => {

//   }, []);
//   return <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
//       <div onClick={() => {
//         window.scrollTo({
//           top: 0,
//           behavior: "smooth"
//         });
//       }} className='fixed bottom-10 border h-10 bg-white shadow-2xl flex items-center justify-center w-10 rounded-full right-10 cursor-pointer'>
//         <ArrowUpIcon className='h-5 w-5' />
//       </div>
//     </PersistGate>
//   </Provider>
// }

const MessengerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 240 240"
    fill="currentColor"
    className="w-6 h-6 text-green-600"
  >
    <path d="M120 0C53.7 0 0 51.4 0 114.8c0 36.2 17 68.4 44.4 89.6V240l40.7-22.2c11.3 3.1 23.2 4.8 35.7 4.8 66.3 0 120-51.4 120-114.8S186.3 0 120 0zm13.5 138.7l-24.4-26.1-51.3 26.1 55.6-59.4 24.4 26.1 51.3-26.1-55.6 59.4z" />
  </svg>
);

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const start = () => {
      setLoading(true);
      toast.loading('กรุณารอสักครู่', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    };
    const end = () => {
      console.log("findished");
      setLoading(false);
      toast.dismiss();
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  React.useEffect(() => {
    // โหลด Google Analytics script
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-T4N0138Y63';
    script.async = true;
    document.head.appendChild(script);

    // กำหนดค่าการใช้งาน GA
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-T4N0138Y63');

  }, []);


  return (
    <>
      <SessionProvider session={session}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>

            <Layout>
              <Toaster
                reverseOrder={false}
              />
              {loading ? (
                <></>
              ) : (
                <Component {...pageProps} />
              )}
            </Layout>

            <div onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }} className='fixed bottom-10 border border-green-200 h-12 bg-white shadow-lg hover:shadow-xl flex items-center justify-center w-12 rounded-full right-4 cursor-pointer transition-all duration-300 hover:bg-green-50'>
              <ArrowUpIcon className='h-6 w-6 text-green-600' />
            </div>
            <div className='fixed bottom-10 border border-green-200 h-12 bg-white shadow-lg hover:shadow-xl flex items-center justify-center w-12 rounded-full right-20 cursor-pointer transition-all duration-300 hover:bg-green-50'>
              <a href="https://www.facebook.com/profile.php?id=100075999497749" target="_blank" rel="noopener noreferrer">
                <MessengerIcon className='h-6 w-6' />
              </a>
            </div>

          </PersistGate>
        </Provider>
      </SessionProvider>
    </>

  )
}

