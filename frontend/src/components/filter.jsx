export default function Filter({setActiveFilter, activeFilter}) {
  const filters = ["All", "Lost", "Found"];
  return (
    <div className="pt-[76px] pb-4 px-4 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex space-x-4 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
                    activeFilter === filter
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
  )
}