import { useEffect } from "react";
import { MdRefresh } from "react-icons/md";

export default function Filter({setActiveFilter, activeFilter, onRefresh}) {
  useEffect(()=>{
    console.log(activeFilter)
  },[activeFilter])
  
  const filters = ["All", "Lost", "Found", "My Posts"];
  
  const handleRefresh = () => {
    if (onRefresh && typeof onRefresh === "function") {
      onRefresh();
    }
  };
  
  return (
    <div className="pt-[76px] pb-4 px- border-b border-gray-100 flex flex-row justify-around">
      <div className=" flex space-x-4 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
              activeFilter === filter
                ? "bg-black text-white "
                : "bg-gray-100 text-black hover:bg-black hover:text-white"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div>
        <button 
          className="px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer bg-gray-100 text-black hover:bg-black hover:text-white flex items-center space-x-1"
          onClick={handleRefresh}
        >
          <MdRefresh size={16} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  )
}