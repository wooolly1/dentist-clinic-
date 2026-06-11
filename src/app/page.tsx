import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import MouseLight from "@/components/ui/MouseLight";
import Hero from "@/components/sections/Hero";
import MouthIntro from "@/components/sections/MouthIntro";
import ProblemScene from "@/components/sections/ProblemScene";
import ContactFooter from "@/components/sections/ContactFooter";
import { PROBLEMS } from "@/data/problems";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <LoadingScreen />
      <MouseLight />
      <Navbar />
      <ScrollProgress />

      <main className="relative">
        {/* Scene 1 — cinematic camera zoom into the patient */}
        <Hero />

        {/* Scene 2 — travelling inside the mouth */}
        <MouthIntro />

        {/* Scene 3 — the dental problems journey, tooth by tooth */}
        <div className="relative bg-ivory">
          {/* subtle grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(31,107,168,0.08) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            {PROBLEMS.map((problem) => (
              <ProblemScene key={problem.id} problem={problem} />
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <ContactFooter />
      </main>
    </SmoothScrollProvider>
  );
}
