"use client";

import { useState } from "react";
import PageContainer from "./PageContainer";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="w-full">
      <div className="flex justify-center h-auto border-b border-gray-200 bg-gray-100 p-2 rounded-b-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer mx-1 ${
              activeTab === tab.id
                ? "text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md transform scale-105"
                : "text-gray-600 hover:text-green-700 hover:bg-white/70 hover:shadow-sm"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex justify-center transition-opacity duration-200 ${
            activeTab === tab.id ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <PageContainer>{tab.content}</PageContainer>
        </div>
      ))}
    </div>
  );
}
