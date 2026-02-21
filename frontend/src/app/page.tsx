import { AppBar } from "@/components/AppBar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
        <AppBar />
        <HeroSection />
        <Footer />
    </div>
  );
}
