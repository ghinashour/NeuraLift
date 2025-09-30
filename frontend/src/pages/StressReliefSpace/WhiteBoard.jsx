import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrush, faEraser } from "@fortawesome/free-solid-svg-icons";
import "./WhiteBoard.css";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("blue");
  const [size, setSize] = useState(5);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    setCtx(context);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx.closePath();
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const useEraser = () => {
    setColor("white"); // Change to the background color (white)
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <button onClick={() => setColor("blue")} style={{ margin: "0 5px" }}>
          <FontAwesomeIcon icon={faBrush} color="blue" />
        </button>
        <button onClick={() => setColor("red")} style={{ margin: "0 5px" }}>
          <FontAwesomeIcon icon={faBrush} color="red" />
        </button>
        <button onClick={() => setColor("green")} style={{ margin: "0 5px" }}>
          <FontAwesomeIcon icon={faBrush} color="green" />
        </button>
        <button onClick={() => setColor("black")} style={{ margin: "0 5px" }}>
          <FontAwesomeIcon icon={faBrush} color="black" />
        </button>
        <button onClick={() => setColor("yellow")} style={{ margin: "0 5px" }}>
          <FontAwesomeIcon icon={faBrush} color="yellow" />
        </button>
        <button onClick={useEraser} style={{ margin: "0 5px" }}>
          <FontAwesomeIcon icon={faEraser} />
        </button>
        <input
          type="range"
          min="1"
          max="50"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={{ margin: "0 10px" }}
        />
        <button onClick={clearCanvas} style={{ margin: "0 5px" }}>
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={470} // Set width to 500px
        height={446} // Set height to 500px
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: "1px solid black", backgroundColor: "white" }}
      />
    </div>
  );
};

export default Whiteboard;
