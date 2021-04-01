import Head from "next/head";
import { useState } from "react";
import { ToggleButtons, ToggleButton } from "../../components/toggle-buttons";

export default function StickerProfile() {
  var [shape, setShape] = useState();
  var [size, setSize] = useState();
  var [colorCount, setColorCount] = useState("0");
  var [showDebug, setShowDebug] = useState(false);
  var [showWarn, setShowWarn] = useState(false);

  function handleNext() {
    if (shape && size && colorCount) {
      setShowWarn(false);
      setShowDebug(true);
    } else {
      setShowWarn(true);
    }
  }

  function handleReset() {
    setShowDebug(false);
    setShape();
    setSize();
    setColorCount("0");
  }

  console.log({ shape, size, colorCount });
  return (
    <div>
      <Head>
        <title>Sticker Profile</title>
      </Head>
      <main class="flex items-center flex-col">
        <div class="p-4 bg-gray-50 my-2">
          <div>Select the shape</div>
          <div>
            <ToggleButtons
              onSelect={(id) => {
                setShape(id);
              }}
            >
              <ToggleButton value="square">SQUARE</ToggleButton>
              <ToggleButton value="circle">CIRCLE</ToggleButton>
            </ToggleButtons>
          </div>
        </div>
        <div class="p-4 bg-gray-50 my-2">
          <div>Select the size</div>
          <div>
            <ToggleButtons
              onSelect={(id) => {
                setSize(id);
              }}
            >
              <ToggleButton value="1/4">1/4"</ToggleButton>
              <ToggleButton value="1/2">1/2"</ToggleButton>
              <ToggleButton value="1">1"</ToggleButton>
              <ToggleButton value="1 1/2">1 1/2"</ToggleButton>
            </ToggleButtons>
          </div>
        </div>
        <div class="p-4 bg-gray-50 my-2">
          <div>Enter how many colors</div>
          <div>
            <input
              onFocus={(event) => event.target.select()}
              class="border"
              type="text"
              name="colorCount"
              maxLength="3"
              value={colorCount}
              onChange={({ target }) => {
                console.log(target.value);
                setColorCount(target.value);
              }}
            />
          </div>
        </div>
        <div>
          <button
            class="border p-2 border-black-50 rounded"
            onClick={handleReset}
          >
            RESET
          </button>
          <button
            class="border p-2 border-black-50 rounded"
            onClick={handleNext}
          >
            NEXT
          </button>
        </div>

        {showDebug && (
          <div class="flex flex-col">
            <div>shape: {shape}</div>
            <div>size: {size}</div>
            <div>color count: {colorCount}</div>
          </div>
        )}
        {showWarn && (
          <p class="text-red-500 font-bold">please enter all info</p>
        )}
      </main>
    </div>
  );
}
