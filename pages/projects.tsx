import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';

export default function ProjectsPage() {
  return (
    <Layout
      title="Our Projects — Amis Relite Limited"
      description="Explore completed and in-progress commercial, residential and civil engineering projects across Nairobi and beyond."
    >
      <PageHero
        crumb="Projects"
        title="Work That"
        em="Speaks for Itself"
        subtitle="More than ten projects delivered with a 100% completion record — filter the portfolio by category, status and location."
        image="/images/belgravia-mall.jpeg"
      />
      <Projects/>
      <Testimonials/>
    </Layout>
  );
}
