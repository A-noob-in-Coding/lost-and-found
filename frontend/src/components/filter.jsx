import { useEffect, useState } from "react";
import { MdRefresh } from "react-icons/md";

export default function Filter({ setActiveFilter, activeFilter, onRefresh }) {
  useEffect(() => {
    console.log(activeFilter);
  }, [activeFilter]);

  const filters = ["All", "Lost", "Found", "My Posts"];

  const handleRefresh = () => {
    if (onRefresh && typeof onRefresh === "function") {
      onRefresh();
    }
  };

  return (
    <div className="px-4 py-4 w-full">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
        <div className="flex flex-row space-x-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white transform scale-105"
                    : "bg-gray-600 text-white hover:bg-black"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            );
          })}
        </div>
        <div>
          <button
            className="px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer flex items-center gap-2 bg-gray-600 text-white hover:bg-black transition-all duration-200"
            onClick={handleRefresh}
          >
            <MdRefresh size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
