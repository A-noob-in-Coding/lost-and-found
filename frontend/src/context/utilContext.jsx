import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const UtilContext = createContext();

export const UtilProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [campuses, setCampuses] = useState([])
  useEffect(() => {
    fetchCategories();
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/utility/campus");
      setCampuses(res.data);
    } catch (err) {
      console.error("Error fetching campuses:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
    }
  };
  return (
    <UtilContext.Provider
      value={{
        categories,
        setCategories,
        campuses,
        setCampuses,
        fetchCategories,
        fetchCampuses,
      }}    >
      {children}
    </UtilContext.Provider>
  );
};
export const useUtil = () => {
  const context = useContext(UtilContext);
  return context;
};

