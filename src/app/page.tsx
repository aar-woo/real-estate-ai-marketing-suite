import ListingForm from "@/components/ListingForm";
import NeighborhoodGuideForm from "@/components/NeighborhoodGuideForm";
import ZillowScraper from "@/components/ZillowScraper";
import Tabs from "@/components/Tabs";

const tabs = [
  {
    id: "zillow-scraper",
    label: "Zillow Listing Scraper",
    content: <ZillowScraper />,
  },
  {
    id: "listing-form",
    label: "Listing Generator",
    content: <ListingForm />,
  },
  {
    id: "neighborhood-guide",
    label: "Neighborhood Guide",
    content: <NeighborhoodGuideForm />,
  },
];

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center min-h-screen gap-8">
      <header
        className="w-full h-[140px] flex items-center justify-center"
        style={{
          position: "relative",
          backgroundImage: "url(/images/abstract-square-houses.png)",
          backgroundSize: "60% 400px",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/50 rounded-lg backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.3)] transition-shadow duration-300">
          <h1 className="text-3xl font-bold text-white relative px-6 py-3 rounded-lg">
            Real Estate AI Marketing Suite
          </h1>
        </div>
      </header>
      <main className="flex flex-col gap-[32px] items-center sm:items-start w-full max-w-6xl sm:px-12">
        <Tabs tabs={tabs} defaultTab="zillow-scraper" />
      </main>
    </div>
  );
}
