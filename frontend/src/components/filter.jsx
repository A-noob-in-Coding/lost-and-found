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
    <div className="bg-gray-50 shadow-md border-b-2 border-gray-300 px-4 py-4 w-full">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
        <div className="flex flex-row overflow-x-auto space-x-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                className={`px-6 py-3 rounded-lg text-sm font-bold whitespace-nowrap cursor-pointer transition-all duration-200 shadow-lg border-2 ${
                  isActive
                    ? "bg-black text-white border-black shadow-xl transform scale-105"
                    : "bg-gray-800 text-white border-gray-800 hover:bg-black hover:border-black hover:shadow-xl"
                }`}
                style={{
                  backgroundColor: isActive ? '#000000' : '#374151',
                  color: '#ffffff',
                  borderColor: isActive ? '#000000' : '#374151'
                }}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            );
          })}
        </div>
        <div>
          <button
            className="px-6 py-3 rounded-lg text-sm font-bold whitespace-nowrap cursor-pointer flex items-center gap-2 bg-gray-800 text-white border-2 border-gray-800 hover:bg-black hover:border-black transition-all duration-200 shadow-lg"
            style={{
              backgroundColor: '#374151',
              color: '#ffffff',
              borderColor: '#374151'
            }}
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
