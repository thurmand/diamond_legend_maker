import React, { useContext, createContext, useState } from "react";

const SelectContext = createContext();

function SelectButtons({ children, onSelect }) {
  var [activeButtons, setActiveButtons] = useState([]);

  function setSelectedButton(id, value) {
    var newValues = activeButtons;
    if (activeButtons.includes(id)) {
      newValues = newValues.filter((symbol) => symbol != id);
      setActiveButtons(newValues);
      return;
    }
    newValues.push(id);
    setActiveButtons(newValues);
    if (onSelect) {
      onSelect(value);
    }
  }

  return (
    <SelectContext.Provider value={{ activeButtons, setSelectedButton }}>
      {React.Children.map(children, (child, i) => {
        var el = React.cloneElement(child, { buttonId: i });
        return el;
      })}
    </SelectContext.Provider>
  );
}

function SelectButton({ buttonId, children, value, className }) {
  var { activeButtons, setSelectedButton } = useContext(SelectContext);
  var style = activeButtons.includes(buttonId)
    ? "border-2 p-2 border-blue-500 focus:outline-none rounded"
    : className || "border p-2 focus:outline-none rounded";
  return (
    <button
      className={style}
      onClick={() => setSelectedButton(buttonId, value)}
    >
      {children}
    </button>
  );
}

export { SelectButtons, SelectButton };
