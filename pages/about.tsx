import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import About from '../components/About';
import Team from '../components/Team';
import CTABanner from '../components/CTABanner';

export default function AboutPage() {
  return (
    <Layout
      title="About Us — Amis Relite Limited"
      description="Seven years of building strong foundations in Kenya — meet the people, values and track record behind Amis Relite Limited."
    >
      <PageHero
        crumb="About"
        title="Building Strong"
        em="Since 2017"
        subtitle="We combine certified engineering, honest communication and meticulous project management to deliver structures that last — across Nairobi, Kiambu, Machakos and beyond."
        image="/images/about-1.jpg"
      />
      <About/>
      <Team/>
      <CTABanner/>
    </Layout>
  );
}
