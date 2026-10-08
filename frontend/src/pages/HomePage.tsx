import Hero from "../components/home/Hero";
import BenefitStrip from "../components/home/BenefitStrip";
import HexMeaning from "../components/home/HexMeaning";
import CategorySection from "../components/home/CategorySection";
import ProductRail from "../components/home/ProductRail";
import AiSearch from "../components/ai/AiSearch";
import IntelligenceLayer from "../components/home/IntelligenceLayer";
import OurStory from "../components/home/OurStory";
import Newsletter from "../components/home/Newsletter";
export default function HomePage() {
  return (
    <>
      <Hero />
      <BenefitStrip />
      <HexMeaning />
      <CategorySection />
      <ProductRail />
      <AiSearch />
      <IntelligenceLayer />
      <OurStory />
      <Newsletter />
    </>
  );
}
