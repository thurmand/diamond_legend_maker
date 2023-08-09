import { useEffect, useState } from "react";
import dmcList from "../lib/dcm2.json";

export default function EnterSymbols({ className, onEnterSymbol }) {
  var [symbol, setSymbol] = useState("");
  var [dmc, setDmc] = useState("");
  var [background, setBackground] = useState("white");
  let symbolInput = null;
  let dmcInput = null;

  useEffect(() => {
    if (dmcList[dmc]?.hex) {
      setBackground(`#${dmcList[dmc]?.hex}`);
    } else {
      setBackground("white");
    }
  }, [dmc]);

  useEffect(() => {
    symbolInput.focus();
  }, []);

  function onEnter(ele) {
    if (event.key === "Enter") {
      if (dmcList[dmc]?.hex && symbol != "") {
        onEnterSymbol({ symbol, hex: `#${dmcList[dmc].hex}`, dmc });
        setSymbol("");
        setDmc("");
        symbolInput.focus();
      } else {
        console.log("not a valid color");
      }
    }
    if (event.key === "Backspace" && dmc === "") {
      symbolInput.focus();
    }
  }

  return (
    <div className={className} style={{ backgroundColor: background }}>
      <div className="flex justify-evenly bg-white px-2 pb-2 rounded-lg">
        <div className="flex flex-col">
          <p className="text-3xl">Symbol</p>
          <input
            onFocus={(event) => event.target.select()}
            className="border-b-2 border-gray-400 text-4xl mt-2 w-24 focus:outline-none"
            type="text"
            maxLength="1"
            value={symbol}
            onChange={({ target }) => {
              setSymbol(target.value);
              if (target.value !== "") {
                dmcInput.focus();
              }
            }}
            autoComplete="off"
            ref={(ref) => {
              symbolInput = ref;
            }}
          />
        </div>
        <div className="p-2" />
        <div className="flex flex-col items-center">
          <p className="text-3xl">Color Code</p>
          <input
            onFocus={(event) => event.target.select()}
            className="mt-2 border-b-2 border-gray-400 text-4xl w-24 focus:outline-none"
            type="text"
            maxLength="5"
            value={dmc}
            onChange={({ target }) => {
              if (isNaN(target.value)) {
                return;
              }
              setDmc(target.value);
            }}
            onKeyDown={onEnter}
            autoComplete="off"
            ref={(ref) => {
              dmcInput = ref;
            }}
          />
        </div>
      </div>

      {background != "white" && (
        <p
          className="text-sm justify-end"
          style={{ color: background, filter: "invert(100%)" }}
        >{`color: ${background}`}</p>
      )}
    </div>
  );
}
