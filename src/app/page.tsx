import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Diagnosis } from "@/components/diagnosis/Diagnosis";
import { WebService } from "@/components/services/WebService";
import { SystemsService } from "@/components/services/SystemsService";
import { AutomationService } from "@/components/services/AutomationService";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main id="contenido">
        <Hero />
        <Problem />
        <Diagnosis />
        <WebService />
        <SystemsService />
        <AutomationService />
        <Work />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
