import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import Pricing from '@/components/sections/Pricing';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Projects />
      <Pricing />
      <Testimonials />
      <Contact />
    </>
  );
}
