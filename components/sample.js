export default function SampleView({ symbol, shape, color }) {
  const shapeVariants = {
    square: "",
    circle: "rounded-full",
  };
  return (
    !!symbol && (
      <div
        className={`${shapeVariants[shape]} w-28 h-28 items-center flex justify-center text-5xl`}
        style={{ backgroundColor: color }}
      >
        {symbol}
      </div>
    )
  );
}
