import { Switch } from "@material-tailwind/react";
import { List } from "react-movable";
import React from "react";

const SymbolList = ({
  values,
  onTextColorChange,
  onClear,
  removeRow,
  profile,
  className,
  onOrderChange,
}) => (
  <div className={className}>
    <p>Total: {values.length}</p>
    <div className="flex items-center gap-2">
      <div className="flex-1">Symbol Color</div>
      <p className="flex-1"></p>
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
      <List
        values={values}
        onChange={({ oldIndex, newIndex }) => onOrderChange(oldIndex, newIndex)}
        renderList={({ children, props }) => <ul {...props}>{children}</ul>}
        renderItem={({ value, props }) => {
          return (
            <LegendItem
              value={value}
              {...props}
              removeRow={removeRow}
              profile={profile}
              onTextColorChange={onTextColorChange}
            />
          );
        }}
      />
    </div>
  </div>
);

export default SymbolList;

function ColorBlock({ symbol, color, textColor, profile }) {
  return (
    <div
      className="flex justify-center items-center text-xl"
      style={{
        width: 32,
        backgroundColor: color,
        color: textColor,
        borderRadius: profile == "circle" ? 50 : 0,
        height: !!symbol && 32,
      }}
    >
      {symbol}
    </div>
  );
}

const LegendItem = React.forwardRef(
  ({ value, onTextColorChange, removeRow, profile, ...props }, ref) => {
    return (
      <li
        className="flex items-center ml-1 py-1 gap-2 hover:cursor-move"
        {...props}
        ref={ref}
      >
        <button
          title="Symbol Color"
          className="border border-black focus:outline-none hover:shadow text-black p-px w-6 h-6"
          onClick={() => {
            onTextColorChange(value.orderId);
          }}
        >
          <div className={`h-full w-full bg-${value.text}`}></div>
        </button>
        <div className="flex flex-1 justify-center">
          <ColorBlock
            symbol={value.symbol}
            textColor={value.text}
            color={value.hex}
            profile={profile}
          />
        </div>
        <p className="flex-1 text-xl">{value.dmc}</p>
        <button
          title="Remove color"
          className="border focus:outline-none hover:shadow hover:text-white hover:bg-red-500 text-red-500 font-bold bg-white rounded px-2"
          onClick={() => {
            removeRow(value.orderId);
          }}
        >
          X
        </button>
      </li>
    );
  }
);
