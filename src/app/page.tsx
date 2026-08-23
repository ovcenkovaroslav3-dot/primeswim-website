import { Hero } from '@/components/sections/Hero';
import { Why } from '@/components/sections/Why';
import { Progress } from '@/components/sections/Progress';
import { Strokes } from '@/components/sections/Strokes';
import { Programs } from '@/components/sections/Programs';
import { Pool } from '@/components/sections/Pool';
import { Training } from '@/components/sections/Training';
import { Schedule } from '@/components/sections/Schedule';
import { Prices } from '@/components/sections/Prices';
import { Coaches } from '@/components/sections/Coaches';
import { Reviews } from '@/components/sections/Reviews';
import { Gallery } from '@/components/sections/Gallery';
import { Faq } from '@/components/sections/Faq';
import { Booking } from '@/components/sections/Booking';
import { Contacts } from '@/components/sections/Contacts';
import { FinalCta } from '@/components/sections/FinalCta';
import { StructuredData } from '@/components/StructuredData';

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Why />
      <Progress />
      <Strokes />
      <Programs />
      <Pool />
      <Training />
      <Schedule />
      <Prices />
      <Coaches />
      <Reviews />
      <Gallery />
      <Faq />
      <FinalCta />
      <Booking />
      <Contacts />
    </>
  );
}
