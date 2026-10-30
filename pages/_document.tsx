import { Html, Head, Main, NextScript } from 'next/document';

/** Apply the visitor's saved theme + accessibility preferences before first paint (no flash). */
const bootScript = `
(function () {
  try {
    var p = JSON.parse(localStorage.getItem('ar.prefs.v1') || '{}');
    var d = document.documentElement;
    var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
    var pref = p.theme || 'light';
    var sys = mq('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    var res = pref === 'system' ? sys : (pref === 'dark' ? 'dark' : 'light');
    var motion = typeof p.motion === 'boolean' ? p.motion : !mq('(prefers-reduced-motion: reduce)');
    d.setAttribute('data-theme', res);
    d.setAttribute('data-theme-pref', pref);
    d.setAttribute('data-text', String(p.scale || 0));
    d.setAttribute('data-contrast', p.contrast ? 'on' : 'off');
    d.setAttribute('data-motion', motion ? 'on' : 'off');
    d.setAttribute('data-links', p.links ? 'on' : 'off');
    d.setAttribute('data-dyslexia', p.dyslexia ? 'on' : 'off');
    d.style.colorScheme = res;
  } catch (e) {}
})();
`;

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
        <meta charSet="utf-8"/>
        <meta name="description" content="Amis Relite Limited — Quality Construction, Built to Last. Nairobi's premier construction company for commercial, residential and civil engineering projects."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta property="og:title" content="Amis Relite Limited — Quality Construction"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://amisreliteltd.co.ke"/>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700&family=Lexend:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <script dangerouslySetInnerHTML={{ __html: bootScript }}/>
      </Head>
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  );
}
