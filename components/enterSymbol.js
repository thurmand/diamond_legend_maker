import { useEffect, useRef, useState } from "react";
import dmcList from "../lib/dcm2.json";
import SampleView from "./sample";
import { Switch } from "@material-tailwind/react";
import DrawSymbolPad from "./drawSymbolPad";

export default function EnterSymbols({ className, onEnterSymbol, shape }) {
  const [symbol, setSymbol] = useState("");
  const [dmc, setDmc] = useState("");
  const [background, setBackground] = useState("transparent");
  const [isWhiteSpace, setWhiteSpace] = useState(false);
  const [symbolMode, setSymbolMode] = useState("text");
  const [drawnStrokes, setDrawnStrokes] = useState([]);
  const symbolInputRef = useRef(null);
  const dmcInputRef = useRef(null);
  const isValidDmc = !!dmcList[dmc]?.hex;
  const hasDrawnSymbol = drawnStrokes.length > 0;

  useEffect(() => {
    if (dmcList[dmc]?.hex) {
      setBackground(`#${dmcList[dmc]?.hex}`);
    } else {
      setBackground("transparent");
    }
  }, [dmc]);

  useEffect(() => {
    if (symbolMode === "text") {
      symbolInputRef.current?.focus();
    } else {
      dmcInputRef.current?.focus();
    }
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [symbolMode]);

  useEffect(() => {
    if (symbolMode !== "text") {
      return;
    }
    if (isWhiteSpace) {
      setSymbol(" ");
      dmcInputRef.current?.focus();
    } else {
      setSymbol("");
    }
  }, [isWhiteSpace]);

  const handleKeyPress = (event) => {
    if (symbolMode !== "text") {
      return;
    }
    if (event.ctrlKey && event.key === " ") {
      setWhiteSpace((prevState) => !prevState);
    }
  };

  function onEnter(event) {
    const hasSymbol = symbolMode === "drawn" ? hasDrawnSymbol : symbol !== "";

    if (event.key === "Enter") {
      if (isValidDmc && hasSymbol) {
        if (symbolMode === "drawn") {
          onEnterSymbol({
            symbolType: "drawn",
            drawnStrokes,
            hex: `#${dmcList[dmc].hex}`,
            dmc,
          });
          setDrawnStrokes([]);
        } else {
          onEnterSymbol({
            symbolType: "text",
            symbol,
            hex: `#${dmcList[dmc].hex}`,
            dmc,
          });
        }

        if (symbolMode === "text" && !isWhiteSpace) {
          setSymbol("");
        }
        setDmc("");
        if (symbolMode === "text" && isWhiteSpace) {
          dmcInputRef.current?.focus();
        } else if (symbolMode === "drawn") {
          dmcInputRef.current?.focus();
        } else {
          symbolInputRef.current?.focus();
        }
      }
    }
    if (event.key === "Backspace" && dmc === "") {
      if (symbolMode === "text" && !isWhiteSpace) {
        symbolInputRef.current?.focus();
      }
    }
  }

  return (
    <div className={className}>
      <div className="flex justify-evenly bg-white/60 p-4 rounded-lg border border-gray-300 shadow-lg gap-4">
        <div className="flex flex-col">
          <label className="text-3xl" htmlFor="symbol-input">
            Symbol
          </label>
          <div className="mt-2 mb-2 flex gap-2">
            <button
              type="button"
              className={`text-xs px-2 py-1 rounded border ${symbolMode === "text" ? "bg-blue-700 text-white border-blue-700" : "bg-white border-gray-500"}`}
              onClick={() => setSymbolMode("text")}
            >
              Text
            </button>
            <button
              type="button"
              className={`text-xs px-2 py-1 rounded border ${symbolMode === "drawn" ? "bg-blue-700 text-white border-blue-700" : "bg-white border-gray-500"}`}
              onClick={() => setSymbolMode("drawn")}
            >
              Draw
            </button>
          </div>
          {symbolMode === "text" ? (
            <input
              id="symbol-input"
              onFocus={(event) => event.target.select()}
              className="border-b-2 border-gray-400 text-4xl mt-2 w-24 focus:outline-none bg-transparent"
              type="text"
              maxLength="1"
              value={isWhiteSpace ? '" "' : symbol}
              onChange={({ target }) => {
                setSymbol(target.value);
                if (target.value !== "") {
                  dmcInputRef.current?.focus();
                }
              }}
              autoComplete="off"
              ref={symbolInputRef}
              disabled={isWhiteSpace}
              aria-describedby="symbol-helper"
            />
          ) : (
            <DrawSymbolPad value={drawnStrokes} onChange={setDrawnStrokes} />
          )}
          <div className="pt-4">
            {symbolMode === "text" ? (
              <>
                <Switch
                  label="Auto Space Entry"
                  id={"iswhite"}
                  ripple={false}
                  color="blue"
                  onChange={() => setWhiteSpace(!isWhiteSpace)}
                  checked={isWhiteSpace}
                />
                <p id="symbol-helper" className="text-xs pt-1 text-gray-700">
                  Tip: press Ctrl + Space to toggle auto-space mode.
                </p>
              </>
            ) : (
              <p id="symbol-helper" className="text-xs pt-1 text-gray-700">
                Draw a symbol, then enter DMC and press Enter.
              </p>
            )}
          </div>
        </div>
        <div className="p-2" />
        <div className="flex flex-col items-center">
          <label className="text-3xl" htmlFor="dmc-input">
            Color Code
          </label>
          <input
            id="dmc-input"
            onFocus={(event) => event.target.select()}
            className="mt-2 border-b-2 border-gray-400 text-4xl w-24 focus:outline-none bg-transparent"
            type="text"
            maxLength="5"
            value={dmc}
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={({ target }) => {
              setDmc(target.value.replace(/\D/g, ""));
            }}
            onKeyDown={onEnter}
            autoComplete="off"
            ref={dmcInputRef}
            aria-invalid={dmc !== "" && !isValidDmc}
            aria-describedby="dmc-helper"
          />
          <p
            id="dmc-helper"
            className={`text-xs pt-1 ${dmc !== "" && !isValidDmc ? "text-red-700" : "text-gray-700"}`}
          >
            {dmc === ""
              ? "Enter a DMC number then press Enter."
              : isValidDmc
                ? `Matched ${background}`
                : "Unknown DMC code."}
          </p>
        </div>
      </div>
      <div className="flex items-center flex-1 flex-col py-8">
        <SampleView
          symbol={symbol}
          color={background}
          shape={shape}
          symbolType={symbolMode}
          drawnStrokes={drawnStrokes}
        />
        {background !== "white" && (
          <p className="text-sm justify-end mt-2">{`color: ${
            background === "transparent" ? "n/a" : background
          }`}</p>
        )}
      </div>
    </div>
  );
}
