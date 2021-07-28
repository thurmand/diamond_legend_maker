import Head from "next/head";
import { useEffect, useState } from "react";
import dmcList from "../lib/dcm2.json";
import { ToggleButtons, ToggleButton } from "../components/toggle-buttons";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
} from "@react-pdf/renderer";

var x = [
  { symbol: "D", hex: "#FFD600", dmc: "444" },
  { symbol: "T", hex: "#F27688", dmc: "899" },
  { symbol: "a", hex: "#FFDFD7", dmc: "225" },
  { symbol: "\\", hex: "#D15807", dmc: "900" },
  { symbol: "3", hex: "#B39F8B", dmc: "3032" },
  { symbol: "+", hex: "#9C599C", dmc: "33" },
  { symbol: "Q", hex: "#000000", dmc: "310", text: "white" },
  { symbol: "x", hex: "#E31D42", dmc: "666" },
];

export default function Symbols() {
  var [symbolList, setSymbolList] = useState(x);
  var [shape, setShape] = useState("square");
  var [size, setSize] = useState("inch");
  var [projectName, setProjectName] = useState("");
  var [preview, setPreview] = useState(false);
  var [isDuplicate, setIsDuplicate] = useState(false);
  var [enteredValue, setEnteredValue] = useState({});

  function onEnterSymbol(values) {
    setEnteredValue(values);
    if (symbolList.find((n) => n.symbol == values.symbol)) {
      setIsDuplicate(true);
      return;
    }
    if (symbolList.find((n) => n.dmc == values.dmc)) {
      setIsDuplicate(true);
      return;
    }
    setIsDuplicate(false);
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
        <title>Diamond Painting Legend</title>
      </Head>
      <main className="flex-1 justify-center">
        <div className="flex flex-col h-screen">
          <ProjectName
            onChange={({ target }) => {
              setProjectName(target.value);
            }}
            value={projectName}
          />
          <div className="border" />
          <div className="flex flex-1">
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
                <div className="flex-1 flex flex-col">
                  {isDuplicate && (
                    <div
                      style={{
                        display: "flex",
                        color: "tomato",
                        fontWeight: "bold",
                        justifyContent: "center",
                      }}
                    >
                      {`Symbol '${enteredValue.symbol}' or DMC# ${enteredValue.dmc} was a duplicate!`}
                    </div>
                  )}
                  {!preview && (
                    <EnterSymbols
                      className="p-4 flex-1 flex flex-col"
                      onEnterSymbol={onEnterSymbol}
                    />
                  )}
                </div>
                {preview && (
                  <PDFViewer style={{ flex: 1 }}>
                    <PreviewPDF
                      data={{ symbolList, shape, size, projectName }}
                    />
                  </PDFViewer>
                )}
              </div>
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => {
                    setPreview(!preview);
                  }}
                  className="border focus:outline-none rounded border-black px-2 bg-white"
                >
                  {"Preview PDF"}
                </button>
              </div>
            </div>
            <div className="border" />
            <ListSymbols
              className="px-4 py-1  h-full overflow-y-scroll"
              values={symbolList}
              onTextColorChange={onTextColorChange}
              onClear={onClear}
              removeRow={removeRow}
              profile={shape}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function EnterSymbols({ className, onEnterSymbol }) {
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
              dmcInput.focus();
            }}
            autoComplete="off"
            ref={(ref) => {
              symbolInput = ref;
            }}
          />
        </div>
        <div className="p-2" />
        <div className="flex flex-col">
          <p className="text-3xl">DMC #</p>
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
        <div className="px-1" />
        <p className="flex-1">DMC</p>
        <div className="px-1" />
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
          <p className="flex-1">{n.dmc}</p>
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
      className="flex justify-center items-center text-lg w-7"
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

function ProjectName({ onChange, value }) {
  return (
    <div className="px-2 my-2">
      <input
        type="text"
        className="mt-2 border-b border-gray-600 text-2xl"
        onChange={onChange}
        value={value}
        placeholder="Legend Name"
      />
    </div>
  );
}

function StickerProfile({ onClick, value }) {
  return (
    <div className="p-4 my-2">
      <div className="text-xl">Shape</div>
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
    <div className="p-4 my-2">
      <div className="text-xl">Size</div>
      <div>
        <ToggleButtons onSelect={onClick} value={value}>
          <ToggleButton value="thirdInch">1/3"</ToggleButton>
          <ToggleButton value="halfInch">1/2"</ToggleButton>
          <ToggleButton value="inch">1"</ToggleButton>
        </ToggleButtons>
      </div>
    </div>
  );
}

function PreviewPDF({ data }) {
  var dmcNumbers = data.symbolList.map((n) => n.dmc).join("   ");
  var a4Inches = {
    thirdInch: { size: 3, font: 16 },
    halfInch: { size: 2, font: 28 },
    inch: { size: 1, font: 60 },
  };
  console.log(data);
  return (
    <Document>
      <Page size="letter" style={{ padding: 16 }} wrap>
        <Text style={{ paddingBottom: 16 }}>{data.projectName}</Text>
        <Text style={{ fontSize: 16 }}>{dmcNumbers}</Text>
        <View style={{ paddingVertical: 16 }} />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {data.symbolList.map((n, i) => (
            <View
              key={i}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: n.hex,
                borderRadius: data.shape == "square" ? 0 : 99,
                width: 72 / a4Inches[data.size].size,
                height: 72 / a4Inches[data.size].size,
              }}
            >
              <Text
                style={{
                  color: n.text,
                  fontSize: a4Inches[data.size].font,
                }}
              >
                {n.symbol}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
