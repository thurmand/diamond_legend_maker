import Head from "next/head";
import { useEffect, useState } from "react";
import dmcList from "../../lib/dcm.json";

export default function Symbols() {
  var [enteredSymbols, setEnteredSymbols] = useState([]);

  function onEnterSymbol(values) {
    console.log({ values, enteredSymbols });
    var list = enteredSymbols;
    list.push({ values });
    setEnteredSymbols(list);
  }

  console.log({ enteredSymbols });
  return (
    <div>
      <Head>
        <title>Symbols</title>
      </Head>
      <main className="flex justify-center py-1">
        <EnterSymbols className="p-4" onEnterSymbol={onEnterSymbol} />
        <div className="border-2" />
        <ListSymbols className="px-4 py-1" values={enteredSymbols} />
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
        onEnterSymbol({ symbol, hex: dmcList[dmc].hex });
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
              class="border"
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
              class="border"
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

function ListSymbols({ values, className }) {
  console.log({ values, className });
  return (
    <div className={className}>
      <div>List</div>
      {values &&
        values.map((n) => (
          <div
            className="flex justify-center"
            style={{ backgroundColor: n.hex }}
          >
            {n.symbol}
          </div>
        ))}
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
