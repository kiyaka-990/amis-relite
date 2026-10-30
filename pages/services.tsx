import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import Services from '../components/Services';
import CTABanner from '../components/CTABanner';

export default function ServicesPage() {
  return (
    <Layout
      title="Our Services — Amis Relite Limited"
      description="Commercial construction, residential projects, design-build, consulting, renovation and site development delivered by one dedicated team."
    >
      <PageHero
        crumb="Services"
        title="What We"
        em="Build"
        subtitle="Six integrated service lines, one accountable team — from first sketch to final handover, on time and within budget."
        image="/images/clock-tower.jpeg"
      />
      <Services/>
      <CTABanner/>
    </Layout>
  );
}
