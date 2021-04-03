import Head from "next/head";
import { useEffect, useState } from "react";
import dmcList from "../../lib/dcm.json";

export default function Symbols() {
  var [symbolList, setSymbolList] = useState([]);

  function onEnterSymbol(values) {
    if (symbolList.find((n) => n.symbol == values.symbol)) {
      console.log("Duplicate!");
      return;
    }
    var newList = [...symbolList];
    values.text == "black";
    newList.push(values);
    setSymbolList(newList);
  }

  function onTextColorChange(symbol) {
    var newList = [...symbolList];
    var x = newList.findIndex((n) => n.symbol == symbol);
    if (newList[x].text === "white") {
      newList[x].text = "black";
    } else {
      newList[x].text = "white";
    }

    setSymbolList(newList);
  }

  function onClear() {
    setSymbolList([]);
  }

  function removeRow(symbol) {
    var newList = [...symbolList];
    newList = newList.filter((n) => n.symbol != symbol);
    setSymbolList(newList);
  }

  return (
    <div>
      <Head>
        <title>Symbols</title>
      </Head>
      <main className="flex justify-center py-1">
        <EnterSymbols className="p-4" onEnterSymbol={onEnterSymbol} />
        <div className="border-2" />
        <ListSymbols
          className="px-4 py-1 w-28"
          values={symbolList}
          onTextColorChange={onTextColorChange}
          onClear={onClear}
          removeRow={removeRow}
        />
      </main>
    </div>
  );
}

function EnterSymbols({ className, onEnterSymbol }) {
  var [symbol, setSymbol] = useState("");
  var [dmc, setDmc] = useState("");
  var [background, setBackground] = useState("white");

  function onEnter(ele) {
    if (event.key === "Enter") {
      if (dmcList[dmc]?.hex) {
        onEnterSymbol({ symbol, hex: `#${dmcList[dmc].hex}` });
        setSymbol("");
        setDmc("");
      } else {
        console.log("not a valid color");
      }
    }
  }

  useEffect(() => {
    if (dmcList[dmc]?.hex) {
      setBackground(`#${dmcList[dmc]?.hex}`);
    } else {
      setBackground("white");
    }
  }, [dmc]);

  return (
    <div className={className} style={{ backgroundColor: background }}>
      <div className="flex bg-white px-2 pb-2 rounded-lg">
        <div className="flex-1">
          Symbol
          <div>
            <input
              onFocus={(event) => event.target.select()}
              className="border"
              type="text"
              name="colorCount"
              maxLength="1"
              value={symbol}
              onChange={({ target }) => {
                setSymbol(target.value);
              }}
              autoComplete={"off"}
            />
          </div>
        </div>
        <div className="p-2" />
        <div className="flex-1">
          DMC Color
          <div>
            <input
              onFocus={(event) => event.target.select()}
              className="border"
              type="number"
              name="colorCount"
              maxLength="5"
              value={dmc}
              onChange={({ target }) => {
                setDmc(target.value);
              }}
              onKeyDown={onEnter}
              autoComplete={"off"}
            />
          </div>
        </div>
      </div>
      <div className="pb-8" />
    </div>
  );
}

function ListSymbols({
  values,
  className,
  onTextColorChange,
  onClear,
  removeRow,
}) {
  return (
    <div className={className}>
      <p>Total: {values.length}</p>
      <div className="flex items-center py-1">
        <button
          title="Delete all"
          class="flex-1 border focus:outline-none hover:shadow text-red-500 font-bold"
          onClick={onClear}
        >
          x
        </button>
        <div className="px-1" />
        <div className="flex-1">W</div>
        <div className="flex-1"></div>
      </div>

      {values.map((n, i) => (
        <div key={i} className="flex items-center py-1">
          <div className="flex-1 justify-start">
            <ColorBlock symbol={n.symbol} textColor={n.text} color={n.hex} />
          </div>
          <div className="px-1" />
          <div>
            <input
              type="checkbox"
              onClick={() => {
                onTextColorChange(n.symbol);
              }}
            />
          </div>
          <div className="px-1" />
          <button
            title="Remove color"
            class="flex-1 border focus:outline-none hover:shadow text-red-500 font-bold"
            onClick={() => {
              removeRow(n.symbol);
            }}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

function ColorBlock({ symbol, color, textColor }) {
  return (
    <div
      className="flex justify-center"
      style={{ backgroundColor: color, color: textColor }}
    >
      {symbol}
    </div>
  );
}

// function SelectButton({
//   onSelect,
//   children,
//   value,
//   className = "border p-2 focus:outline-none rounded",
// }) {
//   var [isSelected, setSelected] = useState(false);
//   var style = isSelected
//     ? "border-2 p-2 border-blue-500 focus:outline-none rounded"
//     : className;

//   function selected() {
//     if (isSelected) {
//       setSelected(false);
//       return;
//     }
//     setSelected(true);
//     if (onSelect) {
//       onSelect(value);
//     }
//   }

//   return (
//     <button className={style} onClick={() => selected()}>
//       {children}
//     </button>
//   );
// }
// var [selectedAlphas, setSelectedAlphas] = useState([]);
// function handleSelectedAlpha(value) {
//   var newValues = selectedAlphas;
//   if (selectedAlphas.includes(value)) {
//     newValues = newValues.filter((symbol) => symbol != value);
//     setSelectedAlphas(newValues);
//     return;
//   }
//   newValues.push(value);
//   setSelectedAlphas(newValues);
// }
