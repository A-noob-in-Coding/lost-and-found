import { useEffect, useState } from "react";
import { MdRefresh } from "react-icons/md";

export default function Filter({ setActiveFilter, activeFilter, onRefresh }) {
  const [hovered, setHovered] = useState(null);
  const [isRefreshHovered, setRefreshHovered] = useState(false);

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
    <div className="pt-[76px] px-4 pb-4 w-full border-b border-gray-100 flex flex-row justify-between">
      <div className="flex flex-row overflow-x-auto">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          const isHovered = hovered === filter;

          return (
            <button
              key={filter}
              onMouseEnter={() => setHovered(filter)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "0.5rem 1.5rem",
                margin: "0rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                cursor: "pointer",
                backgroundColor: isActive
                  ? "#000000"
                  : isHovered
                  ? "#000000"
                  : "#f3f4f6", // gray-100
                color: isActive
                  ? "#ffffff"
                  : isHovered
                  ? "#ffffff"
                  : "#000000",
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
          onMouseEnter={() => setRefreshHovered(true)}
          onMouseLeave={() => setRefreshHovered(false)}
          style={{
            margin: "0rem 1rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            backgroundColor: isRefreshHovered ? "#000000" : "#f3f4f6",
            color: isRefreshHovered ? "#ffffff" : "#000000",
          }}
          onClick={handleRefresh}
        >
          <MdRefresh size={16} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
