import React, { useContext, createContext, useState, useEffect } from "react";

const ToggleContext = createContext();

function ToggleButtons({ children, onSelect, value = "" }) {
  var [activeButton, setActiveButton] = useState(value);

  function setSelectedButton(value) {
    if (activeButton == value) {
      setActiveButton("");
      return;
    }
    setActiveButton(value);
    if (onSelect) {
      onSelect(value);
    }
  }

  return (
    <ToggleContext.Provider value={{ activeButton, setSelectedButton }}>
      {React.Children.map(children, (child) => {
        var el = React.cloneElement(child);
        return el;
      })}
    </ToggleContext.Provider>
  );
}

function ToggleButton({ children, value }) {
  var { activeButton, setSelectedButton } = useContext(ToggleContext);
  var style =
    activeButton === value
      ? "border-2 p-2 border-blue-500 focus:outline-none rounded"
      : "border p-2 focus:outline-none rounded";
  return (
    <button className={style} onClick={() => setSelectedButton(value)}>
      {children}
    </button>
  );
}

export { ToggleButtons, ToggleButton };
