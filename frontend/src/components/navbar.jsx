import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Lost & Found</h1>
      <div className="space-x-4">
        <button className="bg-gray-700 px-3 py-2 rounded">Post Item</button>
        <button className="bg-gray-700 px-3 py-2 rounded">Search</button>
        <button className="bg-gray-700 px-3 py-2 rounded">Filter</button>
      </div>
    </nav>
  );
};

export default Navbar;
