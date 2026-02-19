export default function DrawnSymbol({
  strokes = [],
  color = "black",
  className = "",
  strokeWidth = 0.12,
}) {
  if (!Array.isArray(strokes) || strokes.length === 0) {
    return null;
  }

  return (
    <svg
      className={className}
      viewBox="0 0 1 1"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Drawn symbol"
    >
      {strokes.map((stroke, index) => {
        if (!Array.isArray(stroke) || stroke.length < 2) {
          return null;
        }
        const points = stroke.map((p) => `${p.x},${p.y}`).join(" ");
        return (
          <polyline
            key={index}
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}
