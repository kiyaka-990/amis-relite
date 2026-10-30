import Layout from '../components/Layout';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import CTABanner from '../components/CTABanner';

export default function Home() {
  return (
    <Layout
      title="Amis Relite Limited — Quality Construction, Built to Last"
      description="Nairobi's premier construction company for commercial, residential and civil engineering projects across Kenya."
    >
      <Hero/>
      <StatsBar/>
      <Services limit={3} more={{ label: 'Explore all services', href: '/services' }}/>
      <Projects limit={3} more={{ label: 'View all projects', href: '/projects' }}/>
      <Testimonials/>
      <CTABanner/>
    </Layout>
  );
}
