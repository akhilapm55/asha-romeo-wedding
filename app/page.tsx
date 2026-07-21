import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/system/CustomCursor";
import Nav from "@/components/system/Nav";

import Hero from "@/components/sections/Hero";
import Welcome from "@/components/sections/Welcome";
import Story from "@/components/sections/Story";
import Families from "@/components/sections/Families";
import Events from "@/components/sections/Events";
import Venue from "@/components/sections/Venue";
import Travel from "@/components/sections/Travel";
import Stay from "@/components/sections/Stay";
import Explore from "@/components/sections/Explore";
import Gallery from "@/components/sections/Gallery";
import Rsvp from "@/components/sections/Rsvp";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Nav />
      {/* Approved order: Home · Welcome · Events · Venue · Travel · RSVP ·
          Stay · Our Story · Gallery · Kerala.
          Families stays directly after Our Story (per the earlier round). */}
      <main className="relative z-10">
        <Hero />
        <Welcome />
        <Events />
        <Venue />
        <Travel />
        <Rsvp />
        <Stay />
        <Story />
        <Families />
        <Gallery />
        <Explore />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
