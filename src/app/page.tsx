import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Navbar from "@/components/ui/Navbar";
import SideNav from "@/components/ui/SideNav";
import MouseLight from "@/components/ui/MouseLight";
import Hero from "@/components/sections/Hero";
import ExploreJaw from "@/components/sections/ExploreJaw";
import Orthodontics from "@/components/sections/Orthodontics";
import GumDisease from "@/components/sections/GumDisease";
import Implants from "@/components/sections/Implants";
import Cosmetic from "@/components/sections/Cosmetic";
import ContactFooter from "@/components/sections/ContactFooter";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <LoadingScreen />
      <MouseLight />
      <Navbar />
      <SideNav />

      <main className="relative">
        {/* 1 · realistic patient → cinematic zoom into the mouth */}
        <Hero />

        {/* 2 · Teeth — interactive 3D jaw, every tooth clickable */}
        <ExploreJaw />

        {/* 3 · Orthodontics — scroll-controlled before/after alignment */}
        <Orthodontics />

        {/* 4 · Gum Diseases — inflammation visualization + hotspots */}
        <GumDisease />

        {/* 5 · Dental Implants — interactive implant anatomy */}
        <Implants />

        {/* 6 · Cosmetic Dentistry — before/after + whitening shades */}
        <Cosmetic />

        {/* Closing CTA */}
        <ContactFooter />
      </main>
    </SmoothScrollProvider>
  );
}
