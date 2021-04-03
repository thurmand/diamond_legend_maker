import Head from "next/head";
import { useEffect, useState } from "react";
import dmcList from "../../lib/dcm2.json";
import { ToggleButtons, ToggleButton } from "../../components/toggle-buttons";

export default function Symbols() {
  var [symbolList, setSymbolList] = useState([]);
  var [shape, setShape] = useState("square");
  var [size, setSize] = useState("inch");

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
      <main className="flex-1 justify-center">
        <div className="flex h-screen bg-gray-100">
          <div>
            <StickerProfile
              onClick={(value) => {
                setShape(value);
              }}
              value={shape}
            />
            <StickerSize
              onClick={(value) => {
                setSize(value);
              }}
              value={size}
            />
          </div>
          <div className="border" />
          <div className="flex flex-1 flex-col">
            <div className="flex-1 flex">
              <EnterSymbols
                className="p-4 flex-1 flex flex-col"
                onEnterSymbol={onEnterSymbol}
              />
            </div>
            <div className="p-4 flex justify-end">
              <button
                onClick={() => {
                  console.log("nope");
                }}
                className="border focus:outline-none rounded border-black px-2 bg-white"
              >
                {"Export >"}
              </button>
            </div>
          </div>

          <div className="border" />
          <ListSymbols
            className="px-4 py-1 w-28 h-full overflow-y-scroll"
            values={symbolList}
            onTextColorChange={onTextColorChange}
            onClear={onClear}
            removeRow={removeRow}
            profile={shape}
          />
        </div>
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
      <div className="flex justify-center bg-white px-2 pb-2 rounded-lg">
        <div className="flex flex-col">
          <p className="text-4xl">Symbol</p>
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
        <div className="flex flex-col">
          <p className="text-4xl">DMC Color</p>
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

      {background != "white" && (
        <p
          className="text-sm justify-end"
          style={{ color: background, filter: "invert(100%)" }}
        >{`color: ${background}`}</p>
      )}
    </div>
  );
}

function ListSymbols({
  values,
  className,
  onTextColorChange,
  onClear,
  removeRow,
  profile,
}) {
  return (
    <div className={className}>
      <p>Total: {values.length}</p>
      <div className="flex items-center py-1">
        <button
          title="Delete all"
          className="flex-1 border focus:outline-none hover:shadow text-red-500 font-bold"
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
            <ColorBlock
              symbol={n.symbol}
              textColor={n.text}
              color={n.hex}
              profile={profile}
            />
          </div>
          <div className="px-1" />
          <input
            type="checkbox"
            onClick={() => {
              onTextColorChange(n.symbol);
            }}
          />
          <div className="px-1" />
          <button
            title="Remove color"
            className="flex-1 border focus:outline-none hover:shadow text-red-500 font-bold"
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

function ColorBlock({ symbol, color, textColor, profile }) {
  return (
    <div
      className="flex justify-center text-lg w-7"
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

function StickerProfile({ onClick, value }) {
  return (
    <div className="p-4 bg-gray-50 my-2">
      <div>Select the shape</div>
      <div>
        <ToggleButtons onSelect={onClick} value={value}>
          <ToggleButton value="square">SQUARE</ToggleButton>
          <ToggleButton value="circle">CIRCLE</ToggleButton>
        </ToggleButtons>
      </div>
    </div>
  );
}

function StickerSize({ onClick, value }) {
  return (
    <div className="p-4 bg-gray-50 my-2">
      <div>Select the size</div>
      <div>
        <ToggleButtons onSelect={onClick} value={value}>
          <ToggleButton value="quarter">1/4"</ToggleButton>
          <ToggleButton value="half">1/2"</ToggleButton>
          <ToggleButton value="inch">1"</ToggleButton>
          <ToggleButton value="inch-half">1 1/2"</ToggleButton>
        </ToggleButtons>
      </div>
    </div>
  );
}
