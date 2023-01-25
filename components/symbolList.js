import { Switch } from "@material-tailwind/react";

const SymbolList = ({
  values,
  className,
  onTextColorChange,
  onClear,
  removeRow,
  profile,
}) => (
  <div className={className}>
    <div className="flex flex-row justify-between">
      <p>Total: {values.length}</p>
      <button
        title="Clear all"
        className="border focus:outline-none hover:shadow hover:text-white hover:bg-red-500 text-red-500 font-bold bg-white rounded px-2"
        onClick={onClear}
      >
        Clear All
      </button>
    </div>
    <div className="flex items-center py-1 gap-2">
      <div className="flex-1">W</div>
      <p className="flex-1">DMC</p>
    </div>

    {values.map((n, i) => (
      <div key={i} className="flex items-center py-1 gap-2">
        <Switch
          id={i}
          ripple={false}
          color="white"
          onChange={() => {
            onTextColorChange(n.symbol);
          }}
        />

        <div className="flex flex-1 justify-center">
          <ColorBlock
            symbol={n.symbol}
            textColor={n.text}
            color={n.hex}
            profile={profile}
          />
        </div>
        <p className="flex-1 text-xl">{n.dmc}</p>
        <button
          title="Remove color"
          className="border focus:outline-none hover:shadow hover:text-white hover:bg-red-500 text-red-500 font-bold bg-white rounded px-2"
          onClick={() => {
            removeRow(n.dmc);
          }}
        >
          X
        </button>
      </div>
    ))}
  </div>
);

export default SymbolList;

function ColorBlock({ symbol, color, textColor, profile }) {
  return (
    <div
      className="flex flex-1 justify-center items-center text-xl"
      style={{
        backgroundColor: color,
        color: textColor,
        borderRadius: profile == "circle" ? 50 : 0,
      }}
    >
      {symbol}
    </div>
  );
}
