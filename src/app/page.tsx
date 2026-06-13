import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import MouseLight from "@/components/ui/MouseLight";
import Hero from "@/components/sections/Hero";
import MouthIntro from "@/components/sections/MouthIntro";
import SmileJourney from "@/components/sections/SmileJourney";
import ContactFooter from "@/components/sections/ContactFooter";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <LoadingScreen />
      <MouseLight />
      <Navbar />
      <ScrollProgress />

      <main className="relative">
        {/* Scene 1 — cinematic camera zoom into the reclined patient */}
        <Hero />

        {/* Scene 2 — travelling inside the mouth */}
        <MouthIntro />

        {/* Scene 3 — the interactive smile: hover the teeth, meet the
            specialists, and watch the face turn condition by condition until a
            flawless, healthy smile remains. */}
        <SmileJourney />

        {/* Closing CTA */}
        <ContactFooter />
      </main>
    </SmoothScrollProvider>
  );
}
