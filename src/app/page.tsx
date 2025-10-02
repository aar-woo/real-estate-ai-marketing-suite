"use client";

import { useState, useEffect } from "react";
import ListingForm from "@/components/ListingForm";
import NeighborhoodGuideForm from "@/components/NeighborhoodGuideForm";
import ZillowScraper from "@/components/ZillowScraper";
import Tabs from "@/components/Tabs";
import GatedLandingPage from "@/components/GatedLandingPage";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = sessionStorage.getItem("authenticated");
      setIsAuthenticated(authenticated === "true");
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authenticated");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="font-sans flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-sans flex flex-col items-center min-h-screen">
      <header
        className="w-full h-[90px] flex items-center justify-center"
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
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
          >
            Logout
          </button>
        )}
      </header>
      <main className="flex flex-col gap-[32px] items-center sm:items-start w-full">
        {!isAuthenticated ? (
          <GatedLandingPage onAuthenticated={handleAuthenticated} />
        ) : (
          <Tabs tabs={tabs} defaultTab="zillow-scraper" />
        )}
      </main>
    </div>
  );
}
