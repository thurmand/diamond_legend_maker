import React, { useContext, createContext, useState } from "react";

const ToggleContext = createContext();

function ToggleButtons({ children, onSelect }) {
  var [activeButton, setActiveButton] = useState(null);

  function setSelectedButton(id, value) {
    if (activeButton == id) {
      setActiveButton(null);

      return;
    }
    setActiveButton(id);
    if (onSelect) {
      onSelect(value);
    }
  }

  return (
    <ToggleContext.Provider value={{ activeButton, setSelectedButton }}>
      {React.Children.map(children, (child, i) => {
        var el = React.cloneElement(child, { buttonId: i });
        return el;
      })}
    </ToggleContext.Provider>
  );
}

function ToggleButton({ buttonId, children, value }) {
  var { activeButton, setSelectedButton } = useContext(ToggleContext);
  var style =
    activeButton == buttonId
      ? "border-2 p-2 border-blue-500 focus:outline-none rounded"
      : "border p-2 focus:outline-none rounded";
  return (
    <button
      className={style}
      onClick={() => setSelectedButton(buttonId, value)}
    >
      {children}
    </button>
  );
}

export { ToggleButtons, ToggleButton };
