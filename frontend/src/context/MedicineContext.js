// frontend/context/MedicineContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";

const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = async () => {
    const res = await API.get("/medicines");
    setMedicines(res.data);
  };

  const addMedicine = async (medicineData) => {
    const res = await API.post("/medicines", medicineData);
    setMedicines((prev) => [...prev, res.data]);
  };

  const markMedicineTaken = async (id) => {
    const res = await API.put(`/medicines/${id}/take`);
    setMedicines((prev) =>
      prev.map((m) => (m._id === id ? { ...m, taken: true } : m))
    );
  };

  const deleteMedicine = async (id) => {
    await API.delete(`/medicines/${id}`);
    setMedicines((prev) => prev.filter((m) => m._id !== id));
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <MedicineContext.Provider
      value={{ medicines, addMedicine, markMedicineTaken, deleteMedicine, fetchMedicines }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicineContext = () => useContext(MedicineContext);
