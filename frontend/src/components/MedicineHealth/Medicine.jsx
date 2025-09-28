import "./Medicine.css";
import myImage from "../../assets/MedImg.png";
import React, { useState } from "react";
import { useMedicineContext } from "../../context/MedicineContext";

const MedicineHealth = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const [name, setName] = useState("");
  const [capsule, setCapsule] = useState("");
  const [time, setTime] = useState("");
  const [repeatValue, setRepeatValue] = useState(1);
  const [repeatUnit, setRepeatUnit] = useState("hours");

  const { addMedicine } = useMedicineContext();
  const { medicines } = useMedicineContext();

  const handleSubmit = () => {
    if (!name.trim()) return; // Simple validation

    addMedicine({
      name,
      capsule,
      time,
      repeat: `${repeatValue} ${repeatUnit}`,
    });

    // Reset form
    setName("");
    setCapsule("");
    setTime("");
    setRepeatValue(1);
    setRepeatUnit("hours");
  };
  return (
    <div id="Medicinecontainer">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "50px",
        }}
      >
        <svg
          style={{ marginTop: "11px", marginRight: "10px" }}
          width="40"
          height="32"
          viewBox="0 0 40 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5 27.3337L34.1667 14.0003C34.9455 13.3898 35.5652 12.6617 35.9901 11.8584C36.415 11.055 36.6366 10.1922 36.6422 9.31986C36.6477 8.44753 36.437 7.58299 36.0222 6.77622C35.6075 5.96945 34.9969 5.23645 34.2259 4.61962C33.4548 4.00279 32.5386 3.51435 31.5301 3.18256C30.5217 2.85077 29.441 2.6822 28.3506 2.68661C27.2602 2.69101 26.1817 2.8683 25.1775 3.20823C24.1732 3.54815 23.2632 4.04396 22.5 4.667L5.83333 18.0003C5.05454 18.6109 4.43478 19.3389 4.00987 20.1423C3.58497 20.9457 3.36335 21.8085 3.35785 22.6808C3.35234 23.5531 3.56305 24.4177 3.97779 25.2244C4.39253 26.0312 5.00307 26.7642 5.77411 27.381C6.54515 27.9979 7.4614 28.4863 8.46986 28.8181C9.47833 29.1499 10.559 29.3185 11.6494 29.3141C12.7398 29.3096 13.8183 29.1324 14.8225 28.7924C15.8268 28.4525 16.7368 27.9567 17.5 27.3337Z"
            stroke="#3C83F6"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.1667 11.333L25.8333 20.6663"
            stroke="#3C83F6"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <h1 style={{ textAlign: "center" }}>Medicine & Health</h1>
      </div>
      <p style={{ textAlign: "center", color: "#626A84" }}>
        Don’t skip checking your health , healthy body healthy life !
      </p>

      <div
        style={{
          display: "flex",
          gap: " 100px",
          marginLeft: "50px",
          marginTop: "15px",
        }}
      >
        <div className="medicinebox">
          <svg
            style={{ marginTop: "50px" }}
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="48"
              height="48"
              rx="24"
              fill="url(#paint0_linear_348_153)"
            />
            <path
              d="M22.75 31.0832L31.0833 22.7498C31.4727 22.3682 31.7826 21.9132 31.9951 21.4111C32.2075 20.909 32.3183 20.3697 32.3211 19.8245C32.3238 19.2793 32.2185 18.739 32.0111 18.2348C31.8037 17.7305 31.4985 17.2724 31.1129 16.8869C30.7274 16.5014 30.2693 16.1961 29.7651 15.9887C29.2608 15.7814 28.7205 15.676 28.1753 15.6788C27.6301 15.6815 27.0908 15.7923 26.5887 16.0048C26.0866 16.2172 25.6316 16.5271 25.25 16.9165L16.9167 25.2498C16.5273 25.6314 16.2174 26.0865 16.0049 26.5886C15.7925 27.0907 15.6817 27.6299 15.6789 28.1751C15.6762 28.7203 15.7815 29.2607 15.9889 29.7649C16.1963 30.2691 16.5015 30.7273 16.887 31.1128C17.2726 31.4983 17.7307 31.8036 18.2349 32.0109C18.7392 32.2183 19.2795 32.3237 19.8247 32.3209C20.3699 32.3182 20.9091 32.2074 21.4113 31.9949C21.9134 31.7824 22.3684 31.4726 22.75 31.0832Z"
              stroke="#FAFAFA"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.0833 21.083L26.9167 26.9163"
              stroke="#FAFAFA"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_348_153"
                x1="0"
                y1="0"
                x2="48"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#F6F63C" />
                <stop offset="1" stop-color="#0AE00A" />
              </linearGradient>
            </defs>
          </svg>
          <p style={{ marginTop: "20px", color: "#626A84" }}>Today</p>
        </div>
        <div className="medicinebox">
          <svg
            style={{ marginTop: "50px" }}
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="48"
              height="48"
              rx="24"
              fill="url(#paint0_linear_348_146)"
            />
            <path
              d="M20 14V18"
              stroke="#FAFAFA"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M28 14V18"
              stroke="#FAFAFA"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M31 16H17C15.8954 16 15 16.8954 15 18V32C15 33.1046 15.8954 34 17 34H31C32.1046 34 33 33.1046 33 32V18C33 16.8954 32.1046 16 31 16Z"
              stroke="#FAFAFA"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 22H33"
              stroke="#FAFAFA"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_348_146"
                x1="0"
                y1="0"
                x2="48"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#1456BF" />
                <stop offset="1" stop-color="#6DA2F8" />
              </linearGradient>
            </defs>
          </svg>
          <p style={{ marginTop: "20px", color: "#626A84" }}>
            Upcoming Medicine
          </p>
        </div>
        <div className="medicinebox">
          <svg
            style={{ marginTop: "50px" }}
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="48"
              height="48"
              rx="24"
              fill="url(#paint0_linear_348_160)"
            />
            <path
              d="M32.3334 19.833L25.25 26.9163L21.0834 22.7497L15.6667 28.1663"
              stroke="#FAFAFA"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M27.3333 19.833H32.3333V24.833"
              stroke="#FAFAFA"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_348_160"
                x1="0"
                y1="0"
                x2="48"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#F63C3C" />
                <stop offset="1" stop-color="#F8A26D" />
              </linearGradient>
            </defs>
          </svg>

          <p style={{ marginTop: "20px", color: "#626A84" }}>Week's Insight</p>
        </div>
      </div>
      <div id="upcomingMed">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <img
            style={{ marginTop: "30px", marginLeft: "50px" }}
            src={myImage}
            alt="Img"
          />

          {/* the section that leads to add medicine */}

          <button onClick={openForm} id="addMedBtn">
            + Add Medicine
          </button>
        </div>
        <div className="mainmed-container">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="medicine-card">
              <div className="medicine-details">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h3>{medicine.name}</h3>
                    <p>Capsule: {medicine.capsule || "N/A"}</p>
                  </div>
                  <div className="time-detail">
                    <span className="time"> {medicine.time}</span>
                    <span className="repeat">Every {medicine.repeat}</span>
                  </div>
                </div>
                <button id="take">Take Now</button>
              </div>
            </div>
          ))}
        </div>
        {/* Medicine Form Modal */}
        {isFormOpen && (
          <div className="modal-overlay" onClick={closeForm}>
            <div className="medicine-form" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeForm}>
                &times;
              </button>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <svg
                  style={{ marginTop: "11px", marginRight: "10px" }}
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 27.3337L34.1667 14.0003C34.9455 13.3898 35.5652 12.6617 35.9901 11.8584C36.415 11.055 36.6366 10.1922 36.6422 9.31986C36.6477 8.44753 36.437 7.58299 36.0222 6.77622C35.6075 5.96945 34.9969 5.23645 34.2259 4.61962C33.4548 4.00279 32.5386 3.51435 31.5301 3.18256C30.5217 2.85077 29.441 2.6822 28.3506 2.68661C27.2602 2.69101 26.1817 2.8683 25.1775 3.20823C24.1732 3.54815 23.2632 4.04396 22.5 4.667L5.83333 18.0003C5.05454 18.6109 4.43478 19.3389 4.00987 20.1423C3.58497 20.9457 3.36335 21.8085 3.35785 22.6808C3.35234 23.5531 3.56305 24.4177 3.97779 25.2244C4.39253 26.0312 5.00307 26.7642 5.77411 27.381C6.54515 27.9979 7.4614 28.4863 8.46986 28.8181C9.47833 29.1499 10.559 29.3185 11.6494 29.3141C12.7398 29.3096 13.8183 29.1324 14.8225 28.7924C15.8268 28.4525 16.7368 27.9567 17.5 27.3337Z"
                    stroke="#3C83F6"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.1667 11.333L25.8333 20.6663"
                    stroke="#3C83F6"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <h1 style={{ marginBottom: "20px" }}>Add Medicine</h1>
              </div>
              <div className="form-group">
                <div className="medOpt">Name</div>
                <input
                  type="text"
                  placeholder="Enter medicine name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="medOpt">Capsule</div>
                <input
                  type="text"
                  placeholder="Enter capsule details"
                  value={capsule}
                  onChange={(e) => setCapsule(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="medOpt">Time</div>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="repeat-section">
                <div className="medOpt">Repeat every:</div>
                <div className="repeat-options">
                  <input
                    type="number"
                    min="1"
                    value={repeatValue}
                    onChange={(e) =>
                      setRepeatValue(Math.max(1, e.target.value))
                    }
                  />
                  <select
                    value={repeatUnit}
                    onChange={(e) => setRepeatUnit(e.target.value)}
                  >
                    <option>hours</option>
                    <option>days</option>
                    <option>weeks</option>
                  </select>
                </div>
              </div>

              <button
                className="add-reminder-btn"
                onClick={() => {
                  handleSubmit();
                  closeForm();
                }}
              >
                + Add To Reminders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineHealth;
