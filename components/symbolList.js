import { Switch } from "@material-tailwind/react";

const SymbolList = ({
  values,
  onTextColorChange,
  onClear,
  removeRow,
  profile,
  className,
}) => (
  <div className={className}>
    <p>Total: {values.length}</p>
    <div className="flex items-center gap-2">
      <div className="flex-1">Make Symbol White</div>
      <p className="flex-1">Preview</p>
      <p className="flex-1">Color Code</p>
      <button
        title="Clear all"
        className="border focus:outline-none hover:shadow hover:text-white hover:bg-red-500 text-red-500 font-bold bg-white rounded px-2"
        onClick={onClear}
      >
        Clear All
      </button>
    </div>
    <div className="overflow-y-scroll flex flex-col">
      {values.map((n, i) => (
        <div key={i} className="flex items-center ml-1 py-1 gap-2 ">
          <p>{n.orderId}</p>
          <span>
            <Switch
              id={i}
              ripple={false}
              color="white"
              onChange={() => {
                onTextColorChange(n.symbol);
              }}
            />
          </span>
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
  </div>
);

export default SymbolList;

function ColorBlock({ symbol, color, textColor, profile }) {
  return (
    <div
      className="flex justify-center items-center text-xl"
      style={{
        width: 30,
        backgroundColor: color,
        color: textColor,
        borderRadius: profile == "circle" ? 50 : 0,
        height: !!symbol && 30,
      }}
    >
      {symbol}
    </div>
  );
}
