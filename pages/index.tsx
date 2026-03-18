import Head from 'next/head';
import Navbar       from '../components/Navbar';
import Hero         from '../components/Hero';
import StatsBar     from '../components/StatsBar';
import About        from '../components/About';
import Services     from '../components/Services';
import Projects     from '../components/Projects';
import Testimonials from '../components/Testimonials';
import Team         from '../components/Team';
import FAQ          from '../components/FAQ';
import CTABanner    from '../components/CTABanner';
import Contact      from '../components/Contact';
import Footer       from '../components/Footer';
import Chatbot      from '../components/Chatbot';

export default function Home() {
  return (
    <>
      <Head>
        <title>Amis Relite Limited — Quality Construction, Built to Last</title>
      </Head>
      {/* Mesh background */}
      <div className="mesh-bg"/>
      <Navbar/>
      <Hero/>
      <StatsBar/>
      <About/>
      <Services/>
      <Projects/>
      <Testimonials/>
      <Team/>
      <FAQ/>
      <CTABanner/>
      <Contact/>
      <Footer/>
      <Chatbot/>
    </>
  );
}
