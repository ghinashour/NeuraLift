import React, { createContext, useState, useCallback, useEffect, useContext } from "react";
import API from "../api/axios"; // ✅ uses your configured axios instance

const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);       // all medicines
  const [todayMedicines, setTodayMedicines] = useState([]); // only today's
  const [upcomingMedicines, setUpcomingMedicines] = useState([]); // future ones
  const [stats, setStats] = useState({}); // stats summary (counts, progress, etc.)
  const [loading, setLoading] = useState(true);
  const [activeMedicines, setActiveMedicines] = useState([]);

  
  // ✅ Fetch only active medicines (not taken)
 const fetchActiveMedicines = async () => {
  try {
    const res = await API.get('/medicines/active'); // ✅ correct route
    setActiveMedicines(res.data);
  } catch (err) {
    console.error("Error fetching active medicines:", err);
  }
};


  // 🔹 Fetch all medicines
  const fetchMedicines = useCallback(async () => {
    try {
      const res = await API.get("/medicines");
      setMedicines(res.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  }, []);

  // 🔹 Fetch today's medicines
  const fetchTodayMedicines = useCallback(async () => {
    try {
      const res = await API.get("/medicines/today");
      setTodayMedicines(res.data);
    } catch (error) {
      console.error("Error fetching today's medicines:", error);
    }
  }, []);

  // 🔹 Fetch upcoming medicines
  const fetchUpcomingMedicines = useCallback(async () => {
    try {
      const res = await API.get("/medicines/upcoming");
      setUpcomingMedicines(res.data);
    } catch (error) {
      console.error("Error fetching upcoming medicines:", error);
    }
  }, []);

  // 🔹 Fetch statistics
  const fetchMedicineStats = useCallback(async () => {
    try {
      const res = await API.get("/medicines/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // 🔹 Add new medicine
  const addMedicine = async (medicineData) => {
    try {
      await API.post("/medicines", medicineData);
      await Promise.all([
        fetchMedicines(),
        fetchTodayMedicines(),
        fetchUpcomingMedicines(),
        fetchMedicineStats(),
      ]);
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  // 🔹 Mark a medicine as taken
  const markMedicineTaken = async (id) => {
    try {
      await API.put(`/medicines/${id}/take`);
      // Instantly remove from local states
      setMedicines((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isTaken: true } : m))
      );
      setTodayMedicines((prev) => prev.filter((m) => m._id !== id));
      setUpcomingMedicines((prev) => prev.filter((m) => m._id !== id));

      // Refresh stats after marking
      fetchMedicineStats();
    } catch (error) {
      console.error("Error marking medicine as taken:", error);
    }
  };

  // 🔹 Delete a medicine
  const deleteMedicine = async (id) => {
    try {
      await API.delete(`/medicines/${id}`);
      setMedicines((prev) => prev.filter((m) => m._id !== id));
      setTodayMedicines((prev) => prev.filter((m) => m._id !== id));
      setUpcomingMedicines((prev) => prev.filter((m) => m._id !== id));
      fetchMedicineStats();
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  // 🔹 Fetch everything when app starts
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchMedicines(),
      fetchTodayMedicines(),
      fetchUpcomingMedicines(),
      fetchMedicineStats(),
    ]);
    setLoading(false);
  }, [fetchMedicines, fetchTodayMedicines, fetchUpcomingMedicines, fetchMedicineStats]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        todayMedicines,
        upcomingMedicines,
        stats,
        addMedicine,
        markMedicineTaken,
        deleteMedicine,
        fetchAllData,
        fetchMedicines,
        fetchTodayMedicines,
        fetchUpcomingMedicines,
        fetchMedicineStats,
        activeMedicines,
        fetchActiveMedicines,
        loading,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

// ✅ Custom hook
export const useMedicineContext = () => useContext(MedicineContext);
