import Head from 'next/head';
import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import WhatsAppButton from './WhatsAppButton';
import Accessibility from './Accessibility';
import Chatbot from './Chatbot';

/** Shared chrome for every public page: nav, footer and the floating widgets. */
export default function Layout({ title, description, children }: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description}/>}
      </Head>
      <div className="mesh-bg"/>
      <Navbar/>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer/>
      <ScrollTop/>
      <WhatsAppButton/>
      <Accessibility/>
      <Chatbot/>
    </>
  );
}
