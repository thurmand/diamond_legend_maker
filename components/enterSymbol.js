import { useEffect, useRef, useState } from "react";
import dmcList from "../lib/dcm2.json";
import SampleView from "./sample";
import { Switch } from "@material-tailwind/react";

export default function EnterSymbols({ className, onEnterSymbol, shape }) {
  const [symbol, setSymbol] = useState("");
  const [dmc, setDmc] = useState("");
  const [background, setBackground] = useState("transparent");
  const [isWhiteSpace, setWhiteSpace] = useState(false);
  const symbolInputRef = useRef(null);
  const dmcInputRef = useRef(null);
  const isValidDmc = !!dmcList[dmc]?.hex;

  useEffect(() => {
    if (dmcList[dmc]?.hex) {
      setBackground(`#${dmcList[dmc]?.hex}`);
    } else {
      setBackground("transparent");
    }
  }, [dmc]);

  useEffect(() => {
    symbolInputRef.current?.focus();
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (isWhiteSpace) {
      setSymbol(" ");
      dmcInputRef.current?.focus();
    } else {
      setSymbol("");
    }
  }, [isWhiteSpace]);

  const handleKeyPress = (event) => {
    if (event.ctrlKey && event.key === " ") {
      setWhiteSpace((prevState) => !prevState);
    }
  };

  function onEnter(event) {
    if (event.key === "Enter") {
      if (isValidDmc && symbol !== "") {
        onEnterSymbol({ symbol, hex: `#${dmcList[dmc].hex}`, dmc });
        if (!isWhiteSpace) {
          setSymbol("");
        }
        setDmc("");
        if (isWhiteSpace) {
          dmcInputRef.current?.focus();
        } else {
          symbolInputRef.current?.focus();
        }
      }
    }
    if (event.key === "Backspace" && dmc === "") {
      if (!isWhiteSpace) {
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
          <div className="pt-4">
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
        <SampleView symbol={symbol} color={background} shape={shape} />
        {background !== "white" && (
          <p className="text-sm justify-end mt-2">{`color: ${
            background === "transparent" ? "n/a" : background
          }`}</p>
        )}
      </div>
    </div>
  );
}
