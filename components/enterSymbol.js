import { useEffect, useState } from "react";
import dmcList from "../lib/dcm2.json";
import SampleView from "./sample";
import { Switch } from "@material-tailwind/react";

export default function EnterSymbols({ className, onEnterSymbol, shape }) {
  const [symbol, setSymbol] = useState("");
  const [dmc, setDmc] = useState("");
  const [background, setBackground] = useState("transparent");
  const [isWhiteSpace, setWhiteSpace] = useState(false);
  let symbolInput = null;
  let dmcInput = null;

  useEffect(() => {
    if (dmcList[dmc]?.hex) {
      setBackground(`#${dmcList[dmc]?.hex}`);
    } else {
      setBackground("transparent");
    }
  }, [dmc]);

  useEffect(() => {
    symbolInput.focus();
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (isWhiteSpace) {
      setSymbol(" ");
      dmcInput.focus();
    } else {
      setSymbol("");
    }
  }, [isWhiteSpace]);

  const handleKeyPress = (event) => {
    if (event.ctrlKey && event.key === " ") {
      setWhiteSpace((prevState) => !prevState);
    }
  };

  function onEnter() {
    if (event.key === "Enter") {
      if (dmcList[dmc]?.hex && symbol != "") {
        onEnterSymbol({ symbol, hex: `#${dmcList[dmc].hex}`, dmc });
        if (!isWhiteSpace) {
          setSymbol("");
        }
        setDmc("");
        if (isWhiteSpace) {
          dmcInput.focus();
        } else {
          symbolInput.focus();
        }
      }
    }
    if (event.key === "Backspace" && dmc === "") {
      if (!isWhiteSpace) {
        symbolInput.focus();
      }
    }
  }

  return (
    <div className={className}>
      <div className="flex justify-evenly bg-white/60 p-4 rounded-lg border border-gray-300 shadow-lg">
        <div className="flex flex-col">
          <p className="text-3xl">Symbol</p>
          <input
            onFocus={(event) => event.target.select()}
            className="border-b-2 border-gray-400 text-4xl mt-2 w-24 focus:outline-none bg-transparent"
            type="text"
            maxLength="1"
            value={isWhiteSpace ? '" "' : symbol}
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
            disabled={isWhiteSpace}
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
          </div>
        </div>
        <div className="p-2" />
        <div className="flex flex-col items-center">
          <p className="text-3xl">Color Code</p>
          <input
            onFocus={(event) => event.target.select()}
            className="mt-2 border-b-2 border-gray-400 text-4xl w-24 focus:outline-none bg-transparent"
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
      <div className="flex justify-center items-center felx-1 flex-col py-8">
        <SampleView symbol={symbol} color={background} shape={shape} />
        {background != "white" && (
          <p className="text-sm justify-end mt-2">{`color: ${
            background === "transparent" ? "n/a" : background
          }`}</p>
        )}
      </div>
    </div>
  );
}
