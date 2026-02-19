import { useEffect, useRef } from "react";

const PAD_SIZE = 120;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizePoint(clientX, clientY, rect) {
  const x = clamp((clientX - rect.left) / rect.width, 0, 1);
  const y = clamp((clientY - rect.top) / rect.height, 0, 1);
  return { x, y };
}

export default function DrawSymbolPad({ value = [], onChange }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, PAD_SIZE, PAD_SIZE);
    context.strokeStyle = "#111827";
    context.lineWidth = 8;
    context.lineCap = "round";
    context.lineJoin = "round";

    value.forEach((stroke) => {
      if (!Array.isArray(stroke) || stroke.length < 2) {
        return;
      }
      context.beginPath();
      context.moveTo(stroke[0].x * PAD_SIZE, stroke[0].y * PAD_SIZE);
      for (let i = 1; i < stroke.length; i += 1) {
        context.lineTo(stroke[i].x * PAD_SIZE, stroke[i].y * PAD_SIZE);
      }
      context.stroke();
    });
  }, [value]);

  const drawLineSegment = (fromPoint, toPoint) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.strokeStyle = "#111827";
    context.lineWidth = 8;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(fromPoint.x * PAD_SIZE, fromPoint.y * PAD_SIZE);
    context.lineTo(toPoint.x * PAD_SIZE, toPoint.y * PAD_SIZE);
    context.stroke();
  };

  const handlePointerDown = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = normalizePoint(event.clientX, event.clientY, rect);
    isDrawingRef.current = true;
    currentStrokeRef.current = [point];
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDrawingRef.current) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const point = normalizePoint(event.clientX, event.clientY, rect);
    const stroke = currentStrokeRef.current;
    const previousPoint = stroke[stroke.length - 1];
    stroke.push(point);
    currentStrokeRef.current = stroke;
    drawLineSegment(previousPoint, point);
  };

  const endStroke = () => {
    if (!isDrawingRef.current) {
      return;
    }
    isDrawingRef.current = false;
    const stroke = currentStrokeRef.current;
    if (Array.isArray(stroke) && stroke.length > 1) {
      onChange?.([...value, stroke]);
    }
    currentStrokeRef.current = [];
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <canvas
        ref={canvasRef}
        width={PAD_SIZE}
        height={PAD_SIZE}
        className="bg-white border border-gray-400 rounded touch-none cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
      />
      <div className="flex gap-2">
        <button
          type="button"
          className="text-xs px-2 py-1 rounded border border-gray-500 bg-white hover:bg-gray-100"
          onClick={() => onChange?.([])}
        >
          Clear Drawing
        </button>
        <p className="text-xs text-gray-700 self-center">
          Draw using mouse or touch.
        </p>
      </div>
    </div>
  );
}
