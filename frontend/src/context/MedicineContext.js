// MedicineContext.js
import React, { createContext, useState, useContext } from "react";

const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  const addMedicine = (newMedicine) => {
    setMedicines([...medicines, { ...newMedicine, id: Date.now() }]);
  };

  return (
    <MedicineContext.Provider value={{ medicines, addMedicine }}>
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicineContext = () => useContext(MedicineContext);
