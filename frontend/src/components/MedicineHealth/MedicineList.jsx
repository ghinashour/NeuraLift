import React from "react";
import { Pill } from "lucide-react"; // capsule icon
import { useMedicineContext } from "../../context/MedicineContext";

const MedicineList = () => {
  const { medicines } = useMedicineContext();

  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!medicines.length) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500 italic">
        No medicines added yet 💊
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {medicines.map((med) => (
        <div
          key={med._id}
          className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-sm p-4 hover:shadow-md transition-all duration-200"
        >
          {/* Left section — time & repeat */}
          <div className="text-sm text-gray-600 flex flex-col items-start">
            <span className="font-semibold text-blue-700">{formatTime(med.time)}</span>
            {med.repeat && (
              <span className="text-xs text-gray-500 mt-1">Repeat: {med.repeat}</span>
            )}
          </div>

          {/* Center — medicine name & note */}
          <div className="flex flex-col text-center flex-1 px-4">
            <span className="text-lg font-semibold text-gray-800">{med.name}</span>
            {med.capsule && (
              <span className="text-sm text-gray-500 italic mt-1">{med.capsule}</span>
            )}
          </div>

          {/* Right — capsule icon */}
          <div className="text-blue-600">
            <Pill size={26} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicineList;
