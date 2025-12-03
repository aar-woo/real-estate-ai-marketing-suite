"use client";

import { useState, useEffect } from "react";
import ListingForm from "@/components/ListingForm";
import NeighborhoodGuideForm from "@/components/NeighborhoodGuideForm";
import ZillowScraper from "@/components/ZillowScraper";
import Tabs from "@/components/Tabs";

const tabs = [
  {
    id: "zillow-scraper",
    label: "Marketing Toolkit",
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

  if (isLoading) {
    return (
      <div className="font-sans flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-sans flex flex-col items-center min-h-screen w-full">
      <Tabs tabs={tabs} defaultTab="zillow-scraper" />
    </div>
  );
}
