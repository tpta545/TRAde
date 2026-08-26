import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/layout/trust-bar";
import { FamilyGrid } from "@/components/home/family-grid";
import { BrandGrid } from "@/components/home/brand-grid";
import { RepairBlock } from "@/components/home/repair-block";
import { SocialProof } from "@/components/home/social-proof";
import { BlogNewsletter } from "@/components/home/blog-newsletter";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <TrustBar />
      <FamilyGrid />
      <BrandGrid />
      <RepairBlock />
      <SocialProof />
      <BlogNewsletter />
    </main>
  );
}
