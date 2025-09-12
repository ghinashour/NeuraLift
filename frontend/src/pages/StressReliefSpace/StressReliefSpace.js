import { useState } from "react";
import "./StressReliefSpace.css";
import Whiteboard from "./WhiteBoard";

const StressRelief = () => {
  const [input, setinput] = useState("");
  const [thoughts, setthoughts] = useState([]);

  const handleChange = (event) => {
    setinput(event.target.value);
  };
  const addtask = () => {
    setthoughts([...thoughts, input]);
  };

  return (
    <div id="stresscontainers">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg
          style={{ marginTop: "11px", marginRight: "10px" }}
          width="33"
          height="32"
          viewBox="0 0 33 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.996 23.8625L5.756 19.9785"
            stroke="#3C83F6"
            stroke-width="2.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M25.0013 3.49597C25.2642 3.23315 25.5762 3.02467 25.9196 2.88244C26.2629 2.7402 26.631 2.66699 27.0027 2.66699C27.3743 2.66699 27.7424 2.7402 28.0858 2.88244C28.4292 3.02467 28.7412 3.23315 29.004 3.49597C29.2668 3.75879 29.4753 4.0708 29.6175 4.41419C29.7598 4.75758 29.833 5.12562 29.833 5.49731C29.833 5.86899 29.7598 6.23703 29.6175 6.58042C29.4753 6.92381 29.2668 7.23582 29.004 7.49864L23.6467 12.8573C23.5217 12.9823 23.4515 13.1519 23.4515 13.3286C23.4515 13.5054 23.5217 13.675 23.6467 13.8L24.9053 15.0586C25.5078 15.6612 25.8463 16.4785 25.8463 17.3306C25.8463 18.1828 25.5078 19 24.9053 19.6026L23.6467 20.8613C23.5216 20.9863 23.3521 21.0565 23.1753 21.0565C22.9986 21.0565 22.829 20.9863 22.704 20.8613L11.6387 9.79731C11.5137 9.67229 11.4435 9.50275 11.4435 9.32597C11.4435 9.1492 11.5137 8.97966 11.6387 8.85464L12.8973 7.59597C13.4999 6.99346 14.3172 6.65498 15.1693 6.65498C16.0215 6.65498 16.8387 6.99346 17.4413 7.59597L18.7 8.85464C18.825 8.97962 18.9946 9.04983 19.1713 9.04983C19.3481 9.04983 19.5176 8.97962 19.6427 8.85464L25.0013 3.49597Z"
            stroke="#3C83F6"
            stroke-width="2.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.5 10.6665C10.0947 14.2798 7.20667 15.2798 3.72267 15.9305C3.60709 15.9516 3.49901 16.0025 3.40908 16.0781C3.31914 16.1537 3.25047 16.2514 3.20982 16.3616C3.16917 16.4719 3.15796 16.5908 3.17728 16.7067C3.1966 16.8226 3.24579 16.9314 3.32 17.0225L13.08 28.8665C13.2782 29.0771 13.5396 29.2174 13.8246 29.2665C14.1095 29.3156 14.4028 29.2706 14.66 29.1385C17.48 27.2065 21.8333 22.3892 21.8333 19.9998"
            stroke="#3C83F6"
            stroke-width="2.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <h1 style={{ color: "black" }}>Stress Relief Space</h1>
      </div>
      <p style={{ textAlign: "center", color: "#626A84" }}>
        Express yourself through art and release negative thoughts
      </p>
      <div id="cont2boxes">
        <div id="boardcont">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg
              style={{ marginTop: "12px", marginRight: "10px" }}
              width="30"
              height="30"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.25 5.83333C11.4801 5.83333 11.6667 5.64679 11.6667 5.41667C11.6667 5.18655 11.4801 5 11.25 5C11.0199 5 10.8333 5.18655 10.8333 5.41667C10.8333 5.64679 11.0199 5.83333 11.25 5.83333Z"
                fill="#3C83F6"
                stroke="#3C83F6"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.5833 9.16683C14.8134 9.16683 15 8.98028 15 8.75016C15 8.52004 14.8134 8.3335 14.5833 8.3335C14.3532 8.3335 14.1667 8.52004 14.1667 8.75016C14.1667 8.98028 14.3532 9.16683 14.5833 9.16683Z"
                fill="#3C83F6"
                stroke="#3C83F6"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.08332 6.66683C7.31344 6.66683 7.49999 6.48028 7.49999 6.25016C7.49999 6.02004 7.31344 5.8335 7.08332 5.8335C6.8532 5.8335 6.66666 6.02004 6.66666 6.25016C6.66666 6.48028 6.8532 6.66683 7.08332 6.66683Z"
                fill="#3C83F6"
                stroke="#3C83F6"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.41667 10.8333C5.64679 10.8333 5.83333 10.6468 5.83333 10.4167C5.83333 10.1865 5.64679 10 5.41667 10C5.18655 10 5 10.1865 5 10.4167C5 10.6468 5.18655 10.8333 5.41667 10.8333Z"
                fill="#3C83F6"
                stroke="#3C83F6"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.99999 1.6665C5.41666 1.6665 1.66666 5.4165 1.66666 9.99984C1.66666 14.5832 5.41666 18.3332 9.99999 18.3332C10.7717 18.3332 11.3733 17.7115 11.3733 16.9265C11.3733 16.5623 11.2233 16.2307 11.0092 15.989C10.7675 15.7482 10.6442 15.4457 10.6442 15.0515C10.641 14.8681 10.6748 14.6859 10.7435 14.5159C10.8123 14.3458 10.9145 14.1913 11.0442 14.0616C11.1739 13.9319 11.3284 13.8296 11.4985 13.7609C11.6686 13.6921 11.8507 13.6583 12.0342 13.6615H13.6975C16.24 13.6615 18.3267 11.5757 18.3267 9.03317C18.3042 5.00984 14.5508 1.6665 9.99999 1.6665Z"
                stroke="#3C83F6"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <h1 style={{ color: "black" }}>Creative Canvas</h1>
          </div>
          <Whiteboard />
        </div>

        <div id="thoughtscont">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg
              style={{ marginTop: "9px", marginRight: "10px" }}
              width="35"
              height="35"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.58332 16.6669C8.1738 17.4827 10.0034 17.7037 11.7424 17.29C13.4814 16.8763 15.0155 15.8551 16.0681 14.4104C17.1208 12.9656 17.6228 11.1925 17.4838 9.41034C17.3448 7.62821 16.5738 5.95434 15.3098 4.69036C14.0458 3.42638 12.372 2.65541 10.5899 2.51638C8.80773 2.37735 7.03455 2.87941 5.58984 3.93207C4.14513 4.98474 3.1239 6.51879 2.71018 8.2578C2.29645 9.9968 2.51744 11.8264 3.33332 13.4169L1.66666 18.3335L6.58332 16.6669Z"
                stroke="#3C83F6"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <h1 style={{ color: "black" }}>Release Your Thoughts</h1>
          </div>
          <p
            style={{
              color: "#626A84",
              textAlign: "center",
              width: "500px",
              marginTop: "6px",
              marginBottom: "13px",
            }}
          >
            Write down any negative thoughts, worries, or stress. Once written,
            you can choose to release them.
          </p>

          <input
            type="text"
            id="stressinput"
            onChange={handleChange}
            placeholder="What's weighing on your mind? Write it all out..."
          ></input>
          <button id="stress-btn" onClick={addtask}>
            Capture This Thought
          </button>
          <svg
            style={{ marginTop: "30px" }}
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M10.5333 26.6669C13.0781 27.9723 16.0054 28.3259 18.7878 27.6639C21.5702 27.002 24.0247 25.368 25.709 23.0565C27.3933 20.7449 28.1965 17.9078 27.9741 15.0564C27.7517 12.205 26.5181 9.52685 24.4957 7.50448C22.4734 5.48211 19.7952 4.24856 16.9438 4.02611C14.0924 3.80367 11.2553 4.60695 8.94375 6.29122C6.63221 7.97549 4.99825 10.43 4.33629 13.2124C3.67433 15.9948 4.02791 18.9221 5.33332 21.4669L2.66666 29.3336L10.5333 26.6669Z"
                stroke="#626A84"
                stroke-width="2.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>

          <p
            style={{
              color: "#626A84",
              marginTop: "7px",
              marginBottom: "20px",
            }}
          >
            Thoughts to release
          </p>

          <div
            style={{
              color: "black",
              width: "640px",
              height: "225px",
            }}
          >
            {thoughts.map((thought) => {
              return <p>- {thought}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StressRelief;
