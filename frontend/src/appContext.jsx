import axios from "axios";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const retryTimer = useRef(null);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentlySearchedCities || []);
      } else if (data.message?.includes("setting up")) {
        // FIX: only retry on webhook race condition, not on every failure
        retryTimer.current = setTimeout(fetchUser, 4000);
      }
    } catch (error) {
      // Network/auth errors - don't toast on every silent background retry
      console.error("fetchUser error:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    } else {
      // Clear any pending retry when user logs out
      clearTimeout(retryTimer.current);
      setIsOwner(false);
      setSearchedCities([]);
    }
    return () => clearTimeout(retryTimer.current);
  }, [user]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
