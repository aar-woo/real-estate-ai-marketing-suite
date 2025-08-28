"use client";

import { useState } from "react";

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
      <div className="flex border-b border-white-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-200 rounded-t-lg cursor-pointer ${
              activeTab === tab.id
                ? "text-blue-700 bg-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`transition-opacity duration-200 ${
              activeTab === tab.id ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
