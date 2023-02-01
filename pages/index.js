import Head from "next/head";
import { useState } from "react";
import { ToggleButtons, ToggleButton } from "../components/toggle-buttons";
import SymbolList from "../components/symbolList";
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
} from "@react-pdf/renderer/lib/react-pdf.browser.cjs.js";
import EnterSymbols from "../components/enterSymbol";

// var x = [
//   { symbol: "D", hex: "#FFD600", dmc: "444" },
//   { symbol: "T", hex: "#F27688", dmc: "899" },
//   { symbol: "a", hex: "#FFDFD7", dmc: "225" },
//   { symbol: "\\", hex: "#D15807", dmc: "900" },
//   { symbol: "3", hex: "#B39F8B", dmc: "3032" },
//   { symbol: "+", hex: "#9C599C", dmc: "33" },
//   { symbol: "Q", hex: "#000000", dmc: "310", text: "white" },
//   { symbol: "x", hex: "#E31D42", dmc: "666" },
// ];

export default function Symbols() {
  var [symbolList, setSymbolList] = useState([]);
  var [shape, setShape] = useState("square");
  var [size, setSize] = useState("inch");
  var [projectName, setProjectName] = useState("");
  var [preview, setPreview] = useState(false);
  var [isDuplicate, setIsDuplicate] = useState(false);
  var [enteredValue, setEnteredValue] = useState({});

  function onEnterSymbol(values) {
    setEnteredValue(values);
    if (symbolList.find((n) => n.symbol == values.symbol && n.symbol != " ")) {
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
    newList.unshift(values);
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

  function removeRow(value) {
    var newList = [...symbolList];
    newList = newList.filter((n) => n.dmc != value);
    setSymbolList(newList);
  }

  return (
    <div>
      <Head>
        <title>Diamond Painting Legend</title>
      </Head>
      <main className="flex-1 justify-center">
        <div className="flex flex-1 flex-col h-screen">
          <ProjectName
            onChange={({ target }) => {
              setProjectName(target.value);
            }}
            value={projectName}
          />
          <div className="border" />
          <div className="flex flex-1">
            <div className="w-60">
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
              <div className="p-2">
                Hints:
                <p>
                  - Entering a space as the symbol will create an empty entry.
                  It can be used multiple times. This is for you to draw
                  symbols.
                </p>
              </div>
            </div>
            <div className="border" />
            <div className="flex flex-1 flex-col">
              {!preview && (
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
                  <EnterSymbols
                    className="p-4 flex-1 flex flex-col"
                    onEnterSymbol={onEnterSymbol}
                  />
                </div>
              )}
              {preview && (
                <div className="flex-1 flex flex-col bg-blue-100">
                  <PDFViewer height={"100%"}>
                    <PreviewPDF
                      data={{ symbolList, shape, size, projectName }}
                    />
                  </PDFViewer>
                </div>
              )}
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => {
                    setPreview(!preview);
                  }}
                  className="border focus:outline-none rounded border-black px-2 bg-white"
                >
                  {!preview ? "Preview PDF" : "Add more Colors"}
                </button>
              </div>
            </div>
            <div className="border" />
            <SymbolList
              className="px-4 py-1 h-full overflow-y-scroll max-w-sm w-full"
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
  return (
    <Document>
      <Page size="LETTER" style={{ padding: 16 }} wrap>
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
