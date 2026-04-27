import React from "react";
import Navbar from "./components/Navbar";
import { useLocation, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import Monasteries from "./pages/Monasteries";
import Sikkim from "./pages/Sikkim";
import Footer from "./components/footer";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import HotelReg from "./components/HotelReg";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./appContext.jsx";

const App = () => {
  const { pathname } = useLocation();
  const { showHotelReg } = useAppContext();

  // Hide navbar/footer on owner dashboard and individual room detail pages
  const isFullPage = pathname.startsWith("/owner") || pathname.startsWith("/rooms/");

  return (
    <div>
      <Toaster position="top-right" />
      {!isFullPage && <Navbar />}
      {showHotelReg && <HotelReg />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sikkim" element={<Sikkim />} />
        <Route path="/monastery" element={<Monasteries />} />
        <Route path="/rooms" element={<Hotels />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/myBookings" element={<MyBookings />} />
        <Route path="/owner" element={<OwnerDashboard />} />
      </Routes>
      {!isFullPage && <Footer />}
    </div>
  );
};

export default App;
