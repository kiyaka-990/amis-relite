import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <Layout
      title="Contact Us — Amis Relite Limited"
      description="Request a free quote, book a site visit or ask a question — we respond within 24 hours."
    >
      <PageHero
        crumb="Contact"
        title="Let's Talk"
        em="About Your Project"
        subtitle="Free consultation, free site visit, transparent itemised quote within 24 hours — or message us instantly on WhatsApp."
        image="/images/site.jpeg"
      />
      <FAQ/>
      <Contact/>
    </Layout>
  );
}
