import { useEffect, useState } from "react";
import { MdRefresh, MdFilterList } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";

export default function Filter({ 
  setActiveFilter, 
  activeFilter, 
  onRefresh, 
  campusFilter, 
  setCampusFilter,
  categoryFilter,
  setCategoryFilter 
}) {
  const [showPostTypeDropdown, setShowPostTypeDropdown] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Sample data (not using APIs for now)
  const campuses = [
    { id: 1, name: "FAST NUCES Karachi", location: "Karachi" },
    { id: 2, name: "FAST NUCES Lahore", location: "Lahore" },
    { id: 3, name: "FAST NUCES Islamabad", location: "Islamabad" },
    { id: 4, name: "FAST NUCES Peshawar", location: "Peshawar" },
    { id: 5, name: "FAST NUCES Chiniot-Faisalabad", location: "Chiniot-Faisalabad" }
  ];

  const categories = [
    { id: 1, category: "Personal Items" },
    { id: 2, category: "Electronics" },
    { id: 3, category: "Bags" },
    { id: 4, category: "Books" },
    { id: 5, category: "Clothing" },
    { id: 6, category: "Accessories" }
  ];

  const postTypes = ["All", "Lost", "Found", "My Posts"];

  useEffect(() => {
    console.log(activeFilter);
  }, [activeFilter]);

  const handleRefresh = () => {
    if (onRefresh && typeof onRefresh === "function") {
      onRefresh();
    }
  };

  return (
    <div className="px-4 py-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          {/* Filter Dropdowns */}
          <div className="flex flex-col space-y-3">
            {/* Post Type Filter */}
            <div className="relative">
              <button
                onClick={() => setShowPostTypeDropdown(!showPostTypeDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <MdFilterList className="mr-2" />
                  <span>{activeFilter}</span>
                </div>
                <FaChevronDown className={`transition-transform ${showPostTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showPostTypeDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {postTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setActiveFilter(type);
                        setShowPostTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                        activeFilter === type ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Campus Filter */}
            <div className="relative">
              <button
                onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <MdFilterList className="mr-2" />
                  <span>{campusFilter ? `Campus: ${campuses.find(c => c.id.toString() === campusFilter.toString())?.name || campusFilter}` : "All Campuses"}</span>
                </div>
                <FaChevronDown className={`transition-transform ${showCampusDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCampusDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setCampusFilter("");
                      setShowCampusDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                  >
                    All Campuses
                  </button>
                  {campuses.map((campus) => (
                    <button
                      key={campus.id}
                      onClick={() => {
                        setCampusFilter(campus.id.toString());
                        setShowCampusDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      {campus.name} {campus.location && `- ${campus.location}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <MdFilterList className="mr-2" />
                  <span>{categoryFilter ? `Category: ${categories.find(c => c.id.toString() === categoryFilter.toString())?.category || categoryFilter}` : "All Categories"}</span>
                </div>
                <FaChevronDown className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setCategoryFilter("");
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setCategoryFilter(category.id.toString());
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      {category.category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Refresh Button */}
          <div className="flex justify-center">
            <button
              className="px-8 py-3 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer flex items-center gap-2 bg-gray-600 text-white hover:bg-black transition-all duration-200"
              onClick={handleRefresh}
            >
              <MdRefresh size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex space-x-4 justify-between items-center">
            <div className="flex space-x-4">
              {/* Post Type Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowPostTypeDropdown(!showPostTypeDropdown)}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center space-x-2 min-w-36"
                >
                  <MdFilterList />
                  <span>{activeFilter}</span>
                  <FaChevronDown className={`transition-transform ${showPostTypeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showPostTypeDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {postTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setActiveFilter(type);
                          setShowPostTypeDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                          activeFilter === type ? 'bg-gray-100 font-medium' : ''
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Campus Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center space-x-2 min-w-48"
                >
                  <MdFilterList />
                  <span>{campusFilter ? `Campus: ${campuses.find(c => c.id.toString() === campusFilter.toString())?.name || campusFilter}` : "All Campuses"}</span>
                  <FaChevronDown className={`transition-transform ${showCampusDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCampusDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setCampusFilter("");
                        setShowCampusDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      All Campuses
                    </button>
                    {campuses.map((campus) => (
                      <button
                        key={campus.id}
                        onClick={() => {
                          setCampusFilter(campus.id.toString());
                          setShowCampusDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                      >
                        {campus.name} {campus.location && `- ${campus.location}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors flex items-center space-x-2 min-w-48"
                >
                  <MdFilterList />
                  <span>{categoryFilter ? `Category: ${categories.find(c => c.id.toString() === categoryFilter.toString())?.category || categoryFilter}` : "All Categories"}</span>
                  <FaChevronDown className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setCategoryFilter("");
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setCategoryFilter(category.id.toString());
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                      >
                        {category.category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Refresh Button */}
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
      </div>
    </div>
  );
}
