import React, { useEffect, useState } from "react";
import {
  MdOutlineListAlt,
  MdAdd,
  MdModeEdit,
  MdDelete,
  MdSave,
  MdCancel,
} from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import toast from "react-hot-toast";

const CategoryContainer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ id: null, name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE_URL = "http://localhost:5000/api/categories";

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      setError("Failed to load categories. Please check your API connection.");
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const addPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: newCategory }),
        });

        if (!res.ok) throw new Error("Failed to add category");

        const data = await res.json();
        setCategories([...categories, data]);
        setNewCategory("");
        resolve(`Category "${newCategory}" added successfully`);
      } catch (error) {
        console.error("Error adding category:", error.message);
        setError("Failed to add category. Please try again.");
        reject("Failed to add category");
      }
    });

    toast.promise(addPromise, {
      loading: "Adding category...",
      success: (message) => message,
      error: (err) => err,
    });
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    const categoryToDelete = categories.find((cat) => cat.category_id === id);

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete category");

        setCategories(categories.filter((cat) => cat.category_id !== id));
        resolve(`Category "${categoryToDelete?.category}" deleted`);
      } catch (error) {
        console.error("Error deleting category:", error.message);
        setError("Failed to delete category. Please try again.");
        reject("Failed to delete category");
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting category...",
      success: (message) => message,
      error: (err) => err,
    });
  };

  // Start editing a category
  const startEdit = (category) => {
    setIsEditing(true);
    setEditCategory({ id: category.category_id, name: category.category });
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setEditCategory({ id: null, name: "" });
    toast.dismiss();
  };

  // Save edited category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategory.name.trim()) return;

    const updatePromise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`${API_BASE_URL}/${editCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: editCategory.name }),
        });

        if (!res.ok) throw new Error("Failed to update category");

        setCategories(
          categories.map((cat) =>
            cat.category_id === editCategory.id
              ? { ...cat, category: editCategory.name }
              : cat
          )
        );

        setIsEditing(false);
        setEditCategory({ id: null, name: "" });
        resolve(`Category updated to "${editCategory.name}"`);
      } catch (error) {
        console.error("Error updating category:", error.message);
        setError("Failed to update category. Please try again.");
        reject("Failed to update category");
      }
    });

    toast.promise(updatePromise, {
      loading: "Updating category...",
      success: (message) => message,
      error: (err) => err,
    });
  };

  return (
    <section className="mb-6 sm:mb-10 bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
        Manage Categories
      </h2>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-2">
        <div className="relative flex-1">
          <BiCategory className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-md hover:bg-gray-800 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 font-medium text-sm sm:text-base whitespace-nowrap"
        >
          <MdAdd size={18} />
          Add Category
        </button>
      </form>
      
      {/* Edit Category Form */}
      {isEditing && (
        <form
          onSubmit={handleUpdateCategory}
          className="mb-6 sm:mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
            <MdModeEdit className="text-yellow-500" />
            Edit Category
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <div className="relative flex-1">
              <BiCategory className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-initial bg-green-600 text-white px-4 py-2.5 sm:py-2 rounded-md hover:bg-green-700 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap"
              >
                <MdSave size={18} />
                Save
              </button>

              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 sm:flex-initial bg-gray-600 text-white px-4 py-2.5 sm:py-2 rounded-md hover:bg-gray-700 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap"
              >
                <MdCancel size={18} />
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories List - Improved with Grid/Flex */}
      {loading ? (
        <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
          Loading categories...
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Header - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:flex flex-row justify-between bg-gray-100 rounded-t-lg py-3 px-4 font-semibold text-gray-700 text-sm">
            <div className="w-16">ID</div>
            <div className="flex-1">Category Name</div>
            <div className="w-32 text-right">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.category_id}
                  className="flex flex-col sm:flex-row sm:justify-between hover:bg-gray-50 p-4 sm:py-3 sm:px-4 gap-3 sm:gap-0 sm:items-center border-b sm:border-b-0"
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-500">ID: {category.category_id}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="bg-yellow-500 text-white py-1.5 px-2.5 rounded hover:bg-yellow-600 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center gap-1 text-sm"
                        >
                          <MdModeEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.category_id)}
                          className="bg-red-500 text-white px-2.5 py-1.5 rounded hover:bg-red-600 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center gap-1 text-sm"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="font-medium text-gray-800">{category.category}</div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:w-full sm:justify-between sm:items-center">
                    <div className="w-16 text-gray-800 text-sm">{category.category_id}</div>
                    <div className="flex-1 text-gray-800 text-sm font-medium">
                      {category.category}
                    </div>
                    <div className="w-32 flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center gap-1"
                      >
                        <MdModeEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.category_id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center gap-1"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">
                No categories found. Add a category to get started.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryContainer;
