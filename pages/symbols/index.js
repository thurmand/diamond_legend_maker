import Head from "next/head";
import { useState } from "react";
import { symbols } from "../../lib/symbols";

export default function Symbols() {
  var [selectedAlphas, setSelectedAlphas] = useState([]);

  function handleSelectedAlpha(value) {
    var newValues = selectedAlphas;
    if (selectedAlphas.includes(value)) {
      newValues = newValues.filter((symbol) => symbol != value);
      setSelectedAlphas(newValues);
      return;
    }
    newValues.push(value);
    setSelectedAlphas(newValues);
  }

  return (
    <div>
      <Head>
        <title>Symbols</title>
      </Head>
      <main class="flex items-center flex-col">
        <div>Count Selected</div>
        <div>Select Symbols</div>
        <div>
          <div>Alphabet</div>
          {symbols.alphabet.map((n, i) => (
            <SelectButton
              class="p-2 border border-grey-50 rounded focus:outline-none"
              key={i}
              onSelect={handleSelectedAlpha}
            >
              {n}
            </SelectButton>
          ))}

          <button>SELECT ALL</button>
        </div>
        <div>
          <div>Numbers</div>
          {symbols.numbers.map((n, i) => (
            <button class="p-2 border border-grey-50 rounded" key={i}>
              {n}
            </button>
          ))}
          <button>SELECT ALL</button>
        </div>
        <div>
          <div>Punctuation</div>
          {symbols.punctuation.map((n, i) => (
            <button class="p-2 border border-grey-50 rounded" key={i}>
              {n}
            </button>
          ))}
          <button>SELECT ALL</button>
        </div>
        <div>
          <div>Wrappers</div>
          {symbols.wrappers.map((n, i) => (
            <button class="p-2 border border-grey-50 rounded" key={i}>
              {n}
            </button>
          ))}
          <button>SELECT ALL</button>
        </div>
      </main>
    </div>
  );
}

function SelectButton({
  onSelect,
  children,
  value,
  className = "border p-2 focus:outline-none rounded",
}) {
  var [isSelected, setSelected] = useState(false);
  var style = isSelected
    ? "border-2 p-2 border-blue-500 focus:outline-none rounded"
    : className;

  function selected() {
    if (isSelected) {
      setSelected(false);
      return;
    }
    setSelected(true);
    if (onSelect) {
      onSelect(value);
    }
  }

  return (
    <button className={style} onClick={() => selected()}>
      {children}
    </button>
  );
}

/*
counter at the top of the screen - may not need to enter the color count on first page
enter in all the colors or symbols first
    then it runs through each one and you select symbol or type color

have all the symbols in a list and type the color next them


*/
