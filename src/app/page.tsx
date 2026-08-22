import { Hero } from '@/components/sections/Hero';
import { Programs } from '@/components/sections/Programs';
import { Pool } from '@/components/sections/Pool';
import { Schedule } from '@/components/sections/Schedule';
import { Prices } from '@/components/sections/Prices';
import { Coaches } from '@/components/sections/Coaches';
import { Reviews } from '@/components/sections/Reviews';
import { Gallery } from '@/components/sections/Gallery';
import { Faq } from '@/components/sections/Faq';
import { LeadForm } from '@/components/sections/LeadForm';
import { Contacts } from '@/components/sections/Contacts';
import { StructuredData } from '@/components/StructuredData';

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Programs />
      <Pool />
      <Schedule />
      <Prices />
      <Coaches />
      <Reviews />
      <Gallery />
      <Faq />
      <LeadForm />
      <Contacts />
    </>
  );
}
