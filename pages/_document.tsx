import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8"/>
        <meta name="description" content="Amis Relite Limited — Quality Construction, Built to Last. Nairobi's premier construction company for commercial, residential and civil engineering projects."/>
        <meta property="og:title" content="Amis Relite Limited — Quality Construction"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://amisreliteltd.co.ke"/>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      </Head>
      <body>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  );
}
