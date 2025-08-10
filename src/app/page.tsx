import Image from "next/image";
import ListingForm from "@/components/ListingForm";
import NeighborhoodGuideForm from "@/components/NeighborhoodGuideForm";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] items-center sm:items-start w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Real Estate AI Marketing Suite
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <ListingForm />
          <NeighborhoodGuideForm />
        </div>
      </main>
    </div>
  );
}
