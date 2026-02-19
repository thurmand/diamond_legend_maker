import DrawnSymbol from "./drawnSymbol";

export default function SampleView({
  symbol,
  shape,
  color,
  symbolType = "text",
  drawnStrokes = [],
}) {
  const shapeVariants = {
    square: "",
    circle: "rounded-full",
  };
  const hasSymbol =
    symbolType === "drawn" ? drawnStrokes.length > 0 : symbol !== "";

  return (
    hasSymbol && (
      <div
        className={`${shapeVariants[shape]} w-28 h-28 items-center flex justify-center text-5xl`}
        style={{ backgroundColor: color }}
      >
        {symbolType === "drawn" ? (
          <DrawnSymbol strokes={drawnStrokes} color="black" className="w-16 h-16" />
        ) : (
          symbol
        )}
      </div>
    )
  );
}
