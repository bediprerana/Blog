import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blog_data } from "../assets/assets";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [blogs, setBlogs] = useState(blog_data || []);
  const [input, setInput] = useState("");

  const value = {
    navigate,

    token,
    setToken,

    blogs,
    setBlogs,

    input,
    setInput,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};