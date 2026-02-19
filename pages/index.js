import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import SymbolList from "../components/symbolList";
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  Svg,
  Path,
} from "@react-pdf/renderer";
import EnterSymbols from "../components/enterSymbol";
import { Option, Select } from "@material-tailwind/react";
import { PageHeader } from "../components/header";
import { arrayMove } from "react-movable";
import hints from "../lib/hints.json";
import { buildTestColors } from "../lib/testColors";

const PageTitle = "Diamond Painting Legend Maker";
const ALLOWED_SHAPES = new Set(["square", "circle"]);
const ALLOWED_SIZES = new Set(["thirdInch", "halfInch", "inch"]);

export default function Symbols() {
  const [symbolList, setSymbolList] = useState([]);
  const [shape, setShape] = useState("square");
  const [size, setSize] = useState("inch");
  const [projectName, setProjectName] = useState("");
  const [preview, setPreview] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [enteredValue, setEnteredValue] = useState({});
  const nextItemId = useRef(1);
  const hasSymbols = symbolList.length > 0;

  function onEnterSymbol(values) {
    setEnteredValue(values);
    if (
      values.symbolType !== "drawn" &&
      symbolList.find((n) => n.symbol === values.symbol && n.symbol !== " ")
    ) {
      setIsDuplicate(true);
      return;
    }
    if (symbolList.find((n) => n.dmc === values.dmc)) {
      setIsDuplicate(true);
      return;
    }
    setIsDuplicate(false);
    const newList = [...symbolList];
    const newValue = {
      ...values,
      text: "black",
      id: nextItemId.current++,
    };
    newList.unshift(newValue);
    setSymbolList(newList);
  }

  function onTextColorChange(id) {
    const newList = [...symbolList];
    var x = newList.findIndex((n) => n.id === id);
    if (x < 0) {
      return;
    }
    if (newList[x].text === "white") {
      newList[x].text = "black";
    } else {
      newList[x].text = "white";
    }

    setSymbolList(newList);
  }

  function onClear() {
    if (!hasSymbols) {
      return;
    }
    setSymbolList([]);
    setPreview(false);
  }

  function removeRow(value) {
    let newList = [...symbolList];
    newList = newList.filter((n) => n.dmc !== value.dmc);
    setSymbolList(newList);
  }

  const updateListOrder = (oldIndex, newIndex) => {
    const newList = arrayMove(symbolList, oldIndex, newIndex);
    setSymbolList(newList);
  };

  const handleShapeChange = (value) => {
    if (ALLOWED_SHAPES.has(value)) {
      setShape(value);
    }
  };

  const handleSizeChange = (value) => {
    if (ALLOWED_SIZES.has(value)) {
      setSize(value);
    }
  };

  function addTestColors(count) {
    setSymbolList((previousList) => {
      const generated = buildTestColors({
        count,
        existingValues: previousList,
        startId: nextItemId.current,
      });

      if (generated.length === 0) {
        return previousList;
      }

      nextItemId.current += generated.length;
      return [...generated.reverse(), ...previousList];
    });
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.diamondTest = {
      addColors: (count = 20) => addTestColors(count),
      clear: () => {
        setSymbolList([]);
        setPreview(false);
      },
    };

    return () => {
      delete window.diamondTest;
    };
  }, []);

  return (
    <div
      className={`overflow-hidden h-screen w-screen flex flex-col bg-[url('/closeup.jpg')] bg-center bg-cover`}
    >
      <Head>
        <title>{PageTitle}</title>
        <meta
          name="description"
          content="Create and print your own Diamond Painting legend. Create stickers with colors matching DMC codes. Organize drills your way."
        />
      </Head>
      <div className="overflow-hidden h-full w-full flex flex-col backdrop-blur-sm ">
        <main className="flex flex-1 flex-col overflow-hidden max-w-7xl self-center xl:border-2 w-full xl:rounded-lg xl:m-4 xl:p-2 bg-gray-200/95 ">
          <PageHeader
            onChangeName={setProjectName}
            projectName={projectName}
            className="flex flex-row px-2 pb-2 border-b-2 border-gray-500 flex-wrap items-center justify-between"
            title={PageTitle}
          >
            <div className="flex flex-row flex-wrap gap-2">
              <div>
                <Select
                  label="Shape"
                  value={shape}
                  onChange={handleShapeChange}
                  size="lg"
                  color="blue-gray"
                >
                  <Option value="square">Square</Option>
                  <Option value="circle">Circle</Option>
                </Select>
              </div>
              <div>
                <Select
                  label="Size"
                  value={size}
                  onChange={handleSizeChange}
                  size="lg"
                  color="blue-gray"
                >
                  <Option value="thirdInch">1/3"</Option>
                  <Option value="halfInch">1/2"</Option>
                  <Option value="inch">1"</Option>
                </Select>
              </div>
            </div>
          </PageHeader>
          <div className="overflow-hidden flex flex-1 flex-col">
            <div className="overflow-hidden flex flex-1 flex-col sm:flex-row">
              <div className="flex flex-none sm:flex-1 flex-col">
                {!preview && (
                  <div className="flex-1 flex flex-col">
                    {isDuplicate && (
                      <div
                        role="alert"
                        aria-live="polite"
                        style={{
                          display: "flex",
                          color: "tomato",
                          fontWeight: "bold",
                          justifyContent: "center",
                        }}
                      >
                        {enteredValue.symbolType === "drawn"
                          ? `DMC# ${enteredValue.dmc} is already in the list.`
                          : `Symbol '${enteredValue.symbol}' or DMC# ${enteredValue.dmc} was a duplicate!`}
                      </div>
                    )}
                    <EnterSymbols
                      className="p-4 flex-1 flex flex-col"
                      onEnterSymbol={onEnterSymbol}
                      shape={shape}
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
              </div>
              <SymbolList
                className="overflow-hidden flex flex-1 flex-col gap-2 p-4 max-w-md min-w-[208px] sm:border-l-2 sm:border-t-0 border-t-2 border-l-0 sm:my-4 border-gray-500"
                values={symbolList}
                onTextColorChange={onTextColorChange}
                onClear={onClear}
                removeRow={removeRow}
                profile={shape}
                onOrderChange={updateListOrder}
              />
            </div>
            <div className="p-4 border-t-2 border-gray-500 w-full flex md:justify-between justify-end items-center flex-row">
              <div className="md:block hidden">
                Tips:
                {hints.values.map((hint) => (
                  <p key={hint}>- {hint}</p>
                ))}
              </div>
              <div>
                <button
                  onClick={() => {
                    if (!hasSymbols && !preview) {
                      return;
                    }
                    setPreview(!preview);
                  }}
                  disabled={!hasSymbols && !preview}
                  className="border-pink-600 border-2 focus:outline-none rounded-lg py-2 px-4 bg-pink-500 shadow-lg shadow-pink-500/50 text-white hover:brightness-105 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
                >
                  {!preview ? "Preview PDF" : "Add more Colors"}
                </button>
                {!hasSymbols && !preview && (
                  <p className="text-xs text-gray-700 mt-1 text-right">
                    Add at least one color to preview.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function PreviewPDF({ data }) {
  const { symbolList, projectName, shape, size } = data;
  const dmcNumbers = symbolList.map((n) => n.dmc).join("   ");
  const reversedList = symbolList.slice().reverse();
  const a4Inches = {
    thirdInch: { size: 3, font: 16 },
    halfInch: { size: 2, font: 28 },
    inch: { size: 1, font: 60 },
  };
  const sizeConfig = a4Inches[size] || a4Inches.inch;
  const isCircle = shape === "circle";
  return (
    <Document>
      <Page size="LETTER" style={{ padding: 16 }} wrap>
        <Text style={{ paddingBottom: 16 }}>{projectName}</Text>
        <Text style={{ fontSize: 16 }}>{dmcNumbers}</Text>
        <View style={{ paddingVertical: 16 }} />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {reversedList.map((n, i) => (
            <View
              key={i}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: n.hex,
                ...(isCircle ? { borderRadius: 99 } : {}),
                width: 72 / sizeConfig.size,
                height: 72 / sizeConfig.size,
              }}
            >
              {n.symbolType === "drawn" ? (
                <Svg
                  viewBox="0 0 1 1"
                  style={{
                    width: 48 / sizeConfig.size,
                    height: 48 / sizeConfig.size,
                  }}
                >
                  {(n.drawnStrokes || []).map((stroke, pathIndex) => (
                    <Path
                      key={pathIndex}
                      d={strokeToPath(stroke)}
                      stroke={n.text || "black"}
                      strokeWidth={0.08}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </Svg>
              ) : (
                <Text
                  style={{
                    color: n.text,
                    fontSize: sizeConfig.font,
                  }}
                >
                  {n.symbol}
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

function strokeToPath(stroke) {
  if (!Array.isArray(stroke) || stroke.length === 0) {
    return "";
  }
  const [first, ...rest] = stroke;
  return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(" ")}`;
}
